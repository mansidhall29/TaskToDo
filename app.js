//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const datetime = require('node-datetime');
const cron = require('node-cron');
const ejs = require("ejs");
const _ = require("lodash");
// var popup = require('popups');
const alert = require('alert');


const app = express();



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Data-Base
mongoose.connect("mongodb+srv://Mansi:Rajman1234@todoapp.l0ntl.mongodb.net/MyTaskManage\", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }); // connection to mongo db server;


//Create a schema
const task_schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    duration: { type: Number, required: true },
    created_at: {
        type: Date,
        default: Date.now,
    },
    delete_at: Date,
});

// Object of the ;Schema
const Task_management = new mongoose.model("Task", task_schema);

var add_minutes = function(dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }
    // Schedule tasks to be run on the server.
var i = 0;
cron.schedule("*/10 * * * * *", function() {
    console.log('running a task after every 10 seconds');

    // this thing is running every minute;
    console.log("****************************************************************************************", i);
    Task_management.find({}, function(err, list_of_tasks) {

        var list_of_delete = [];
        for (var i = 0; i < list_of_tasks.length; i++) {
            var that_date = list_of_tasks[i].created_at;
            var delete_date = add_minutes(that_date, list_of_tasks[i].duration);
            var current_time = new Date();

            if (current_time >= delete_date) {
                // Delete from data base.
                list_of_delete.push(list_of_tasks[i]);
            }
            // console.log(that_date, current_time, delete_date);

            // let cur_date = new Date();
            // // current date
            // console.log(cur_date, that_date);
            // // current hours
            // let h_that = that_date.getHours();
            // let m_that = that_date.getMinutes();
            // let h_cur = cur_date.getHours();
            // let m_cur = cur_date.getMinutes();
            // console.log("Time for Created-> ", h_that + " : ", m_that, "   Time current", h_cur, m_cur);


            // console.log(i, list_of_tasks[i].id, list_of_tasks[i].duration, that);
        }

        var flag = 0;

        if (list_of_delete.length > 0) {
            alert("Tasks Deleted Please Refresh the Page");
            flag = 1;

        }
        console.log("size of ", list_of_delete.length, flag);

        for (var i = 0; i < list_of_delete.length; i++) {
            var cur = list_of_delete[i];
            Task_management.remove({ _id: cur._id }, function(err) {
                if (!err) {
                    console.log("deleted-> check the size")
                } else {
                    console.log("Error");
                }
            });

        }
        if (flag == 1) {
            app.get(function(req, res) {
                res.redirect("/list");

            });
        }





    });

    ++i;
});



app.get("/", function(req, res) {
    res.render("frontpage");
});

app.get("/list", function(req, res) {
    Task_management.find({}, function(err, list_of_tasks) {
        res.render("home", {
            tasks_list: list_of_tasks
        });
    });



});

app.get("/add", function(req, res) {
    res.render("compose");
});



app.post("/add", function(req, res) {
    var dt = new Date();
    const task = new Task_management({
        name: req.body.taskname,
        description: req.body.taskdes,
        creator: req.body.creator,
        duration: req.body.duration,
        delete_at: add_minutes(dt, req.body.duration)
    });
    // Task_management.find({}).sort({ created_at: 'ascending' }).exec((err, docs) => {
    //     if (err) {
    //         console.log("error");
    //     } else {
    //         console.log("done");
    //     }
    // });



    task.save(function(err) {
        if (!err) res.redirect("/list");
        else console.log(err);
    });

});



app.listen(3005, function() {
    console.log("Server started on port 3005");
});