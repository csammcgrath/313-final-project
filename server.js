const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const session = require('express-session');
const sharedsession = require("express-socket.io-session");

const { Pool } = require('pg');

const PORT = process.env.PORT || 8888;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString
});

const helpers = require('./files/scripts');

//SERVER INITIALIZATION
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//SESSION INITIALIZATION
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'tacocat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

io.use(sharedsession(session)); 

//ROUTES
//res.sendFile(path.join(__dirname, '/public/home.html'))
//res.sendFile(path.join(__dirname, '/public/login.html'))
app.get('/', (req, res) => res.render('pages/home', { sessionVar: req.session.username }));
app.get('/login', (req, res) => helpers.renderLoginLogic(req, res));
app.get('/login-signOut', (req, res) => helpers.signOutUser(req, res));
app.post('/login-createUser', (req, res) => helpers.loginUser(req, res, pool));
app.get('/registration', (req, res) => helpers.createUser(req, res));
app.post('/registration-create', (req, res) => helpers.createUserDatabase(req, res, pool));

//SOCKET IO STUFF
io.on('connection', (socket) => {
  socket.on('login', (usr) => {
    socket.handshake.session.username = usr;
    socket.handshake.session.save();
  });

  socket.on('logout', (usr) => {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.username;
      socket.handshake.session.save();
    }
  });  

  socket.on('new_message', (data) => {
    console.log(`message: ${data.message}`);

    io.sockets.emit('new_message', { message: data.message });
  });
});

//LISTENER
http.listen(PORT, () => console.log(`Listening on port ${PORT}`));