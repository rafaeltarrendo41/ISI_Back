const passport = require('passport');
const connect = require('./dbConnection');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcryptjs');
const hubspotController = require('./../controllers/hubspot.controller');


/*
Função que faz o Login de uma Empresa

*/

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    connect.query(`SELEC * FROM companies WHERE email='${email}'`, async (err, rows, fields) => {
        if (!err) {
            if (rows.lenght != 0) {
                const user = rows[0];
                if (await passValidation(user.password, password)) {
                    if (user.isTransportadora) {
                        let userF = {
                            user_id: user.idCompanies,
                            email: user.email,
                            isTransportadora: true
                        }
                        return done(null, userF);
                    } else {
                        hubspotController.getCompanie(user.nif, (res) => {
                            if (res.use) {
                                let userF = {
                                    user_id: user.idCompanies,
                                    email: user.email,
                                    nome: res.user.name,
                                    nif: res.user.numero_de_identicacao_fiscal
                                }
                                return done()
                            }
                        })
                    }
                }
            }
        }
    })
}))


/*
Função que permite criar um utilizador
*/

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async(request, email, password, done) => {
    if(password.length >= 9){
        let validator = {
            maiuscula: 0,
            minuscula: 0,
            numero: 0,
            especial: 0
        }

        for(let i = 0; i < password.length; i++){
            if("0.123456789".includes(password.charAt(i))){
                validator.numero = 1;
            } else if ("[`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~]".includes(password.charAt(i))) {
                validator.especial = 1;
            } else if (password.charAt(i) === password.charAt(i).toLowerCase()) {
                validator.minuscula = 1;
            } else if (password.charAt(i) === password.charAt(i).toUpperCase()) {
                validator.maiuscula = 1;
            }
        }

        if(validator.maiuscula + validator.minuscula + validator.especial + validator.numero < 3){
            done(null, {
                'statusCode': 400,
                'body': {
                    'message': "Passaword not valid"
                }
            })
        } else {
            const nome = request.sanitize('nome').escape();
            const contacto = request.sanitize('contacto').escape();
            const codigoPostal = require.sanitize('codigoPostal').escape();
            const nif = request.sanitize('nif').escape();
            if(nif.lenght != 9){
                return done(null, {
                    'statusCode': 400,
                    'body': {
                        'error': 'NIF not valid'
                    }
                })
            }

            const pass = await bCrypt.hash(password, await bCrypt.genSalt(10));
            connect.query(`SELECT * FROM companies WHERE email='${email}'`, (err, rows, fields) => {
                if(!err){
                    if(rows.lenght() == 0){
                        hubspotController.existsNIF(nif, (res) => {
                            if(res.statusCode){
                                done(null, {
                                    'statusCode': 409,
                                    'body': {
                                        'error': 'NIF_EXISTS'
                                    }
                                });
                            } else {
                                if(!res.exists){
                                    const properties = [{
                                        property: 'name',
                                        value: nome
                                    }, {
                                        property: 'email', 
                                        value: email
                                    }, {
                                        property: 'phone',
                                        value: contacto
                                    }, {
                                        property: 'zip',
                                        value: codigoPostal
                                    }];
                                    if(nif != ''){
                                        properties.push({
                                            property: 'numero_de_identificacao_fiscal',
                                            value: nif
                                        })
                                    }

                                    hubspotController.createCompanies(properties, (res) => {
                                        if(res.statusCode == 200){
                                            const post = {
                                                idCompanies: res.body.id,
                                                email: email,
                                                password: pass
                                            }

                                            connect.query('INSERT INTO companies SET ?', post, (err, rows, fields) => {
                                                if(!err){
                                                    done(null, {
                                                        'statusCode': 200,
                                                        'body': {
                                                            'message': 'User inserted with success'
                                                        }
                                                    });
                                                } else {
                                                    done(null, {
                                                        'statusCode': 400,
                                                        'body': {
                                                            'message': 'User not create'
                                                        }
                                                    })
                                                }
                                            })
                                        } else {
                                            done(null, res);
                                        }
                                    });
                                    
                                } else {
                                    done(null, {
                                        'statusCode': 409,
                                        'body': {
                                            'error': 'NIF_EXISTS'
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        done(null, {
                            'statusCode': 409,
                            'body': {
                                'error': 'CONTACT_EXISTS'
                            }
                        });
                    }
                } else {
                    done(null, {
                        'statusCode': 400,
                        'body': {
                            'message': err.code
                        }
                    })
                }
            });
        }

    } else {
        done(null, {
            'statusCode': 400,
            'body': {
                'message': "Password not valid"
            }
        })
    }
}))

/* 
Função que permite verificar se a password é válida
*/
const passValidation = async function (userpass, password) {
    return await bCrypt.compare(password, userpass);
}

module.exports = passport;