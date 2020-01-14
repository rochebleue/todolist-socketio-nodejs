var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var taskList = [];

app.use('/public', express.static('public'));

/////////////// SOCKETS ///////////////

io.sockets.on('connection', function (socket) {

	socket.on('LIST_REQUEST', function () {
	    socket.emit('LIST_REFRESH', taskList);
	});
	socket.on('LIST_ADD', function (taskValue) {
		taskList.push(taskValue);
		socket.emit('LIST_REFRESH', taskList);
		socket.broadcast.emit('LIST_REFRESH', taskList);
	});
	socket.on('REMOVE_ELEM', function (taskId) {
		if (taskList.length > (taskId)) {
			taskList.splice(taskId, 1);
		}
	    socket.emit('LIST_REFRESH', taskList);
	    socket.broadcast.emit('LIST_REFRESH', taskList);
	});

});

/////////// EXPRESS ROUTES ///////////

app.get('/', function(req, res) {
	console.log(taskList);
    res.setHeader('Content-Type', 'text/html');
    res.render('tasks.ejs', {
		title: 'Todolist with node',
		tasks: taskList
	});
})
.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

server.listen(8080);