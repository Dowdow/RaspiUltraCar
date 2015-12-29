var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require('pi-gpio');
var async = require('async');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/font', express.static(__dirname + '/font'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
  socket.on('up', function() {
    forward();
  });
  socket.on('down', function() {
    backward();
  });
  socket.on('left', function() {
    left();
  });
  socket.on('right', function() {
    right();
  });
  socket.on('stop', function() {
    stop();
  });
});

var Motor1A = 16;
var Motor1B = 18;
var Motor1E = 22;
 
var Motor2A = 19;
var Motor2B = 21;
var Motor2E = 23;

function init() {
  gpio.open(Motor1A, 'output');
  gpio.open(Motor1B, 'output');
  gpio.open(Motor1E, 'output');
  gpio.open(Motor2A, 'output');
  gpio.open(Motor2B, 'output');
  gpio.open(Motor2E, 'output');
}

function forward() {
  gpio.write(Motor1A, 0);
  gpio.write(Motor1B, 1);
  gpio.write(Motor1E, 1);
  gpio.write(Motor2A, 0);
  gpio.write(Motor2B, 1);
  gpio.write(Motor2E, 1);
}

function backward() {
  gpio.write(Motor1A, 1);
  gpio.write(Motor1B, 0);
  gpio.write(Motor1E, 1);
  gpio.write(Motor2A, 1);
  gpio.write(Motor2B, 0);
  gpio.write(Motor2E, 1);
}

function left() {
  gpio.write(Motor1A, 0);
  gpio.write(Motor1B, 1);
  gpio.write(Motor1E, 1);
  gpio.write(Motor2A, 1);
  gpio.write(Motor2B, 0);
  gpio.write(Motor2E, 1);
}

function right() {
  gpio.write(Motor1A, 1);
  gpio.write(Motor1B, 0);
  gpio.write(Motor1E, 1);
  gpio.write(Motor2A, 0);
  gpio.write(Motor2B, 1);
  gpio.write(Motor2E, 1);
}

function stop() {
  gpio.write(Motor1E, 0);
  gpio.write(Motor2E, 0);
}

process.stdin.resume();
function exit() {
  gpio.close(Motor1A);
  gpio.close(Motor1B);
  gpio.close(Motor1E);
  gpio.close(Motor2A);
  gpio.close(Motor2B);
  gpio.close(Motor2E);
  process.exit();
};
process.on('exit', exit);
process.on('SIGINT', exit);
process.on('uncaughtException', exit);

init();
http.listen(3000);
