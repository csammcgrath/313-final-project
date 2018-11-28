const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { Pool } = require('pg');

const PORT = process.env.PORT || 8888;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString
});

const helpers = require('./files/scripts');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ROUTES
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/home.html')));
app.post('/login-createUser', (req, res) => helpers.loginUser(req, res, pool));

//


//SOCKET IO
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