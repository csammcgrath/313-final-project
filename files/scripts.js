function createUser(req, res) {

}

function loginUser(req, res, pool) {
    console.log(req.body);
    queryDatabase(req, res, pool, (err, data) => {
        if (err) {
            console.log(err);
            res.json({success: false});
        }

        res.json({success: true, data: data[0]})
    });
}

function queryDatabase(req, res, pool, callback) {
    let username = req.body.username;
    let password = req.body.password;

    let query = 'SELECT id, username, password FROM users WHERE username = $1::string';
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