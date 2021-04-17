module.exports = function(app, passport){
    app.post('/register', (request, response, next) => {
        passport.authenticate('local-signup', (err, info) => {
            if(err){
                return response.status(400).json({
                    'message': err
                })
            }
            return response.status(info.statusCode).send(info.body);
        })(request, response, next);
    });
};