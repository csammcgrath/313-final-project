function createUser(req, res) {

}

function loginUser(req, res, pg, cString) {
    
    pg.connect(cString, (err, client, done) => {
        if (err) {
            done();
            console.log('Error with database... Additional info: ', err);
            return res.status(500).json({
                success: false
            });
        }

        let username = req.body.username;
        let password = req.body.password;
        let queryStatement = 'SELECT id, username, password FROM users WHERE username = $1::string';
        let params = [username];

        pg.query(queryStatement, params, (err, results) => {
            if (err) {
                console.log(`ERROR: ${err}`);
                return null;
            }

            console.log(`Results: ${JSON.stringify(results.rows)}`);
        });
    });

    res.json({success: true})
}

module.exports = {
    createUser,
    loginUser
}