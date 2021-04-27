const bCrypt = require('bcryptjs');
const connect = require('./../config/dbConnection');
const req = require('request');

const hubspotController = require('./hubspot.controller');
const jasminController = require('./jasmin.controller');

function getCompanies(request, response) {
    hubspotController.getCompanies((res) => {
        if (res.users) {
            const users = res.users;
            response.status(200).send({
                'users': users
            })

        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

function createCompanie(request, response) {
    hubspotController.createCompanies(request.body, (res) => {
        if (res.statusCode = 200) {
            response.status(200).send({
                'user': res.body
            })
        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

function updateCompanie(request, response) {
    //console.log(JSON.stringify(request));
    hubspotController.updateCompanies(request.body.id_companie, request.body.properties, (res) => {
        if (res.statusCode == 200) {
            response.status(200).send({
                'resposta': res.body
            })
        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

/*
Ver se exist nif
*/

function existeNif(request, response) {
    //console.log(request.body.properties.nif);
    hubspotController.existsNIF(request.body.properties.nif, (res) => {
        if (res.statusCode == 200) {
            response.status(200).send({
                'resposta': res.existe
            })
        } else {
            response.status(res.statusCode).send({
                'resposta': res.existe
            });
        }
    })
}

function verAtachemnts(request, response) {
    //console.log(request.body.properties.nif);
    hubspotController.verAtachemnts(request.body.idCompanie, (res) => {
        if (res.anexos) {
            const users = res.anexos;
            response.status(200).send({
                'anexos': users
            })

        } else {
            response.status(res.statusCode).send(res.body);
        }
    })

}


function addFiles(request, response) {
    hubspotController.addFiles((res) => {
        if (res.statusCode == 200) {
            const fileId = res.body;
            var options = {
                'companieId': request.body.companieId,
                'fileId': fileId
            }
            hubspotController.createEngagement(options, (resp) =>{
                if(resp.statusCode == 200){
                    response.status(resp.statusCode).send({
                        'anexos': true
                    })
                } else {
                    response.status(resp.statusCode).send(resp.body);
                }
            });
        } else {
            response.sendStatus(res.statusCode).send({
                'resposta': res.body
            });
        }
    })
}

function registerCompanie(req, response) {
    console.log(req);
    const email = req.body.properties.email;
    const nome = req.body.properties.name;
    const pass = req.body.properties.pass;
    const nif = req.body.properties.numero_de_identificacao_fiscal;
    //const city = req.body.properties.city;
    const contacto = req.body.properties.phone;

    let passCripto = "";
    const hashPassword = async () => {
        const hash = await bCrypt.hash(pass, 10)
        passCripto = hash;
       // console.log(await bcrypt.compare(password, hash))
      }
      
      hashPassword()
    connect.query(`SELECT * FROM companies WHERE email='${email}'`, (err, rows, fields) => {
        if (!err) {
            if (rows.length == 0) {
                hubspotController.existsNIF(nif, (res) => {
                    if (res.statusCode == 400) {
                        response.status(409).send({
                            'aa': 'cona',
                            'body': {
                                'error': 'NIF_EXISTS'
                            }
                        })
                    } else {
                        if (res.existe == false) {
                            const properties = {
                                "properties": {
                                    'name': nome,
                                    'email': email,
                                    'phone': contacto,
                                    'numero_de_identificacao_fiscal': nif
                                }
                            };
                           
                            hubspotController.createCompanies(properties, (res) => {
                                if (res.statusCode == 200) {
                                    const post = {
                                        idcompanies: res.body.user_id,
                                        email: email,
                                        pass: passCripto
                                    }
                                    connect.query('INSERT INTO companies SET ?', post, (err, rows, fields) => {
                                        if (!err) {
                                            response.status(200).send({
                                                'body': {
                                                    'message': 'User inserted with success'
                                                }
                                            })
                                        } else {
                                            response.status(400).send({
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
                response.status(409).send({
                    'body': {
                        'error': 'CONTACT_EXISTS'
                    }
                });
            }
        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

module.exports = {
    getCompanies: getCompanies,
    createCompanie: createCompanie,
    updateCompanie: updateCompanie,
    existeNif: existeNif,
    verAtachemnts: verAtachemnts,
    registerCompanie: registerCompanie,
    addFiles: addFiles
}