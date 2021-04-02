To Do List application, to note down the tasks and their description for a particular time period. Task will be deleted once the duration gets over.

User can insert a todo record with a sample schema like:

- Task name
- Task description
- Creator
- Duration
- createdAt

Technologies Used:
-NodeJs for BackEnd, REST API
-Mongoose database
-JavaScript, HTML, CSS for FrontEnd

there are two end points:
- /add - POST endpoint which adds the data
- /list - GET endpoint which lists all the data

In the app.js file, connection with database is made, data gets stored in the database when user adds data, CRUD opeartion for updation, reading and deletion is used.
CRON job is used for deleting the task once duration is over, it runs every 10 seconds and as soon as 'creation time + duration' becomes more than current time task gets deleted.
