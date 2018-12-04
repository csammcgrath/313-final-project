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

            if (dbUser === user && dbPass === pass) {
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
        }
    });
}

function checkUsername(usr, pool) {
    getUsersDatabase(usr, pool, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }

        return (data.length === 0) ? true : false;
    });
}

function createUserDatabase(req, res, pool) {
    let usr = req.body.username;
    let checkFlag = checkUsername(usr, pool);

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

            if (data.length === 0) {
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
    let username = req.body.user;

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
    let password = req.body.pass;

    let query = 'INSERT INTO users(username, password) VALUES $1, $2;';
    let params = [username, password];

    pool.query(query, params, (err, results) => {
        if (err) {
            console.log(`ERR: ${err}`);
            callback(err);
        }

        req.session.username = username;

        callback(null, results.rows);
    });
}

module.exports = {
    createUser,
    loginUser,
    signOutUser,
    renderLoginLogic,
    createUserDatabase
}