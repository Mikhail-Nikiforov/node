#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
const io = require('socket.io');
const http = require('http');
const glob = require('glob');
const querystring = require('querystring');
const { GlobSync } = require('glob');
const { Worker } = require('worker_threads')

const numCPUs = os.cpus().length;

function searchWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });

    worker.on('message', resolve);
    worker.on('error', reject);
  })
}

let onlineCounter = 0;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started...`);

  const app = http.createServer((request, response) => {
    console.log(`Worker ${process.pid} handle this request...`);
    const queryParams = querystring.parse(request.url.split('?')[1]);
    
    if ((request.method === 'GET') && (queryParams.getDirectoryTree == 1)) {

      let startPath = `test`;
      let directoryTree = glob.sync(startPath + '/**/*');

      directoryTree = directoryTree.map((item, index) => {
        const itemName = item.slice(item.lastIndexOf(`/`) + 1),
          children = [];
        
        if (item.split(`/`).length == 2) {
          return {
            id: index,
            name: itemName,
            path: item,
            children: children
          }
        }
        return {
          id: index,
          name: itemName,
          path: item,
          children: children
        }
      });

      response.writeHead(200, { 'Content-Type': 'json' });
      response.write(JSON.stringify(directoryTree));
      response.end();

    } else if ((request.method === 'GET') && (queryParams.getFileText)) {
      const filePath = path.join(__dirname, queryParams.getFileText);
      
      searchWorker(filePath)
        .then(result => {
          console.log(result);

          response.writeHead(200, { 'Content-Type': 'text/plain' });   

          response.write(JSON.stringify(result));
          response.end();
        })
        .catch(err => console.error(err));

    } else if (request.method === 'GET') {
      const filePath = path.join(__dirname, 'index.html');
      readStream = fs.createReadStream(filePath);

      response.writeHead(200, { 'Content-Type': 'text/html'});
      readStream.pipe(response);
    } else if (request.method === 'POST') {

      let data = ``;

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
  
  })

  const socket = io(app);

  socket.on('connection', function (socket) {
    console.log('New connection');
    ++onlineCounter;

    socket.emit('ONLINE_COUNTER', { onlineCounter: onlineCounter });
    socket.broadcast.emit('ONLINE_COUNTER', { onlineCounter: onlineCounter});
    
    socket.on('disconnect', function () {
      console.log('Disconnection');
      --onlineCounter;
      
      socket.emit('ONLINE_COUNTER', { onlineCounter: onlineCounter});
      socket.broadcast.emit('ONLINE_COUNTER', { onlineCounter: onlineCounter});
    });
  });
  
  app.listen(3000, 'localhost');
}