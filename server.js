const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 8888;

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ROUTES
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/home.html')));

//SOCKET IO
// io.on('connection', (socket) => console.log('A user has connected.'));

io.set('transports', ['websocket']);

io.on('connection', (socket) => {
  console.log('An user has connected!');

  socket.on('disconnect', () => {
    console.log('An user has disconnected.');
  });

  socket.on('new_message', (data) => {
    console.log(`message: ${data.message}`);

    io.sockets.emit('new_message', { message: data.message });
  });
});

//SETUP LISTENER
http.listen(PORT, () => console.log(`Listening on port ${PORT}`));