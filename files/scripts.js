function createUser(req, res) {

}

function loginUser(req, res, pool) {
    console.log(req.body);
    queryDatabase(req, res, pool, (err, data) => {
        if (err) {
            console.log(err);
            res.json({success: false});
        }

        if (!data[0]) {
            console.log('Your username or password is incorrect. Please try again');
            res.writeHead(302, {
                'Location': '/login'
            });
            res.end();
        }

        let user = req.body.user;
        let pass = req.body.user;
        let dbUser = data[0].username;
        let dbPass = data[0].password;

        if (dbUser === user && dbPass === pass) {
            req.sessions.username = dbUser;
            console.log('Successfully logged in!');

            res.writeHead(302, {
                'Location': '/'
            });

            res.end();
        } else {
            console.log('Your username or password is incorrect. Please try again');
            res.writeHead(302, {
                'Location': '/login'
            });
            res.end();
        }
        // res.json({success: true, data: data[0]})
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

module.exports = {
    createUser,
    loginUser
}