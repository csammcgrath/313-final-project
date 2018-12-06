const bcrypt = require('bcrypt');

function createUser(req, res) {
    if (req.session.username) {
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    } else {
        res.render('pages/registration');
    }
}

function renderLoginLogic(req, res) {
    if (req.session.username) {
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    } else {
        res.render('pages/login');
    }
}

function loginUser(req, res, pool) {
    queryDatabase(req, res, pool, (err, data) => {
        if (err) {
            console.log(err);
            res.json({success: false});
        }

        if (data.length === 0) {
            console.log('Your username or password is incorrect. Please try again.');
            res.writeHead(302, {
                'Location': '/login'
            });
            res.end();
        } else {
            let user = req.body.user;
            let pass = req.body.pass;
            let dbUser = data[0].username;
            let dbPass = data[0].password;

            bcrypt.compare(pass, dbPass, (err, results) => {
                if (err) {
                    console.log('Your username or password is incorrect. Please try again.');
                    res.writeHead(302, {
                        'Location': '/login'
                    });
                    res.end();
                }

                if (dbUser === user && results) {
                    req.session.username = dbUser;
                    console.log('Successfully logged in!');

                    res.writeHead(302, {
                        'Location': '/'
                    });

                    res.end();
                } else {
                    console.log('Your username or password is incorrect. Please try again.');
                    res.writeHead(302, {
                        'Location': '/login'
                    });
                    res.end();
                }
            });
        }
    });
}

//doesn't quite work yet.
function checkUsername(usr, pool, callback) {
    console.log('checkUsername: ', usr);
    getUsersDatabase(usr, pool, (err, data) => {
        if (err) {
            console.log(err);
            callback(err);
        }

        callback(null, (data.length === 0) ? true : false);
    });
}

function createUserDatabase(req, res, pool) {
    let usr = req.body.user;
    console.log(`Username: ${usr}`);
    checkUsername(usr, pool, (err, checkFlag) => {
        console.log(`checkFlag: `, checkFlag);
        if (err) {
            console.log('Error: ', err);
            res.json({ success: false });
        }

        if (checkFlag) {
            console.log('Username already exists!');

            res.writeHead(302, {
                'Location': '/registration'
            });

            res.end();
        } else {
            insertDatabase(req, res, pool, (err, data) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false });
                }

                if (data || data.length === 0) {
                    res.writeHead(302, {
                        'Location': '/registration'
                    });
                    res.end();
                } else {
                    res.writeHead(302, {
                        'Location': '/'
                    });
                    res.end();
                }
            });
        }
    }); 
}

function signOutUser(req, res) {
    if (!req.session.username) {
        res.writeHead(302, {
            'Location': '/'
        });

        res.end();
    } else {
        req.session.destroy((err) => {
            if (err) {
                console.log('ERROR: ', err);

                res.writeHead(302, {
                    'Location': '/'
                });

                res.end();
            }

            res.writeHead(302, {
                'Location': '/'
            });

            res.end();
        });
    }
}

function getUsersDatabase(username, pool, callback) {
    let query = 'SELECT username FROM users where username = $1';
    let params = [username];

    pool.query(query, params, (err, results) => {
        if (err) {
            console.log(`ERR: ${err}`);
            callback(err);
        }

        console.log('Results: ', JSON.stringify(results.rows));

        callback(null, results.rows);
    });
}

function queryDatabase(req, res, pool, callback) {
    let username = req.body.user;
    let password = req.body.pass;

    let query = 'SELECT id, username, password FROM users WHERE username = ($1)';
    let params = [username];

    pool.query(query, params, (err, results) => {
        if (err) {
            console.log(`ERR: ${err}`);
            callback(err);
        }

        console.log('Results: ', JSON.stringify(results.rows));

        callback(null, results.rows);
    });
}

function insertDatabase(req, res, pool, callback) {
    let username = req.body.user;
    let password = req.body.pass0;

    //hash password - bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log('Error: ', err);
            callback(err);
        }

        let query = 'INSERT INTO users(username, password) VALUES ($1, $2)';
        let params = [username, hash];

        pool.query(query, params, (err, results) => {
            if (err) {
                console.log(`ERR: ${err}`);
                callback(err);
            }

            req.session.username = username;

            callback(null, results.rows);
        });
    });
}

module.exports = {
    createUser,
    loginUser,
    signOutUser,
    renderLoginLogic,
    createUserDatabase
}