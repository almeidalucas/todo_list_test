const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    tasksAPI = require('./api/tasks.js'),
    displayRoutes = require('express-routemap'),
	cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use('/tasks', tasksAPI);


var port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    displayRoutes(app);
});