function createUser(req, res) {

}

function loginUser(req, res, pg, cString) {
    queryDatabase(req, res, pg, cString, (err, results) => {
        if (err) {
            res.json({
                success: false,
                data: null
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });  

    res.json({
        success: 'NEVER'
    });
}

function queryDatabase(req, res, pg, cString, callback) {
    pg.connect(cString, (err, client, done) => {
        if (err) {
            done();
            console.log('Error with database... Additional info: ', err);
            callback(err);
        }

        let username = req.body.username;
        let password = req.body.password;
        let queryStatement = 'SELECT id, username, password FROM users WHERE username = $1::string';
        let params = [username];

        let query = client.query(queryStatement, params);

        done();
        callback(null, query);
    });
}

module.exports = {
    createUser,
    loginUser
}