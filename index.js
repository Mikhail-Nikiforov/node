const io = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = http.createServer((request, response) => {
  if (request.method === 'GET') {
	const filePath = path.join(__dirname, 'index.html');
  
    readStream = fs.createReadStream(filePath);

    readStream.pipe(response);
  } else if (request.method === 'POST') {
    let data = '';

    request.on('data', chunk => {
	data += chunk;
    });

    request.on('end', () => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);

      response.writeHead(200, { 'Content-Type': 'json'});
      response.end(data);
    });
  } else {
      response.statusCode = 405;
      response.end();
  }
});

const socket = io(app);

const session = require('express-session');
const sessionMiddleware = session({
  secret: "Большой секрет",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 600000 },
  
});

socket.on('connection', function (socket) {
    console.log('New connection');

    socket.broadcast.emit('NEW_CONN_EVENT', { msg: `The User#${socket.id.substring(0, 5)} connected` });

    socket.on('CLIENT_MSG', (data) => {
        socket.emit('SERVER_MSG', { msg: `User#${socket.id.substring(0, 5)}: ${data.msg}` });
        socket.broadcast.emit('SERVER_MSG', { msg: `User#${socket.id.substring(0, 5)}: ${data.msg}` });
    });
    
    socket.on('disconnect', function () {
        console.log('Disconnection');

        socket.broadcast.emit('NEW_CONN_EVENT', { msg: `The User#${socket.id.substring(0, 5)} disconnected` });
    });

    socket.on('reconnect', function () {
        console.log('Reconnecting');

        socket.broadcast.emit('NEW_CONN_EVENT', { msg: `The User#${socket.id.substring(0, 5)} reconnecting` });
    });
});



app.listen(3000, 'localhost');

