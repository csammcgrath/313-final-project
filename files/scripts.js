function createUser(req, res) {

}

function loginUser(req, res, pg, cString) {
    checkDatabase(req, res, pg, cString, (err, results) => {
        if (err || results.length < 1) {
            res.status(500).json({
                success: true,
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
}

function checkDatabase(req, res, pg, cString, checkDatabaseCallback) {
    let username = req.body.username;
    let password = req.body.password;
    let queryStatement = 'SELECT id, username, password FROM users WHERE username = $1::string';
    let params = [username];

    pg.query(queryStatement, params, (err, results) => {
        if (err) {
            console.log(`ERROR: ${err}`);
            checkDatabaseCallback(err);
        }

        checkDatabaseCallback(null, results.rows);
    });
}

module.exports = {
    createUser,
    loginUser
}