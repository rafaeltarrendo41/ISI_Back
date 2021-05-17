const bCrypt = require('bcryptjs');
const connect = require('./../config/dbConnection');
const req = require('request');
const nodemailer = require('nodemailer');

const hubspotController = require('./hubspot.controller');
const jasminController = require('./jasmin.controller');
const moloniController = require('./moloni.controller');

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
            var tamanho = Object.keys(users);
            console.log(tamanho.length);
            let usersF = [];
            for (let i = 0; i < tamanho.length; i++) {
                usersF.push({
                    'id': users[i].url
                })
            }
            response.status(200).send({
                usersF
            });

        } else {
            response.status(res.statusCode).send(res.body);
        }
    })

}


function addFiles(request, response) {
    //const file =  request.body.file;
    console.log(request);
    hubspotController.addFiles(request, (res) => {
        if (res.statusCode == 200) {
            const fileId = res.body;
            console.log(fileId);
            response.sendStatus(res.statusCode).send({
                'resposta': fileId
            })
        } else {
            response.sendStatus(res.statusCode).send({
                'resposta': res.body
            });
        }
    })
}

function precisaValidacao(req, response) {
    connect.query(`SELECT * FROM companies WHERE verificado = false`, (err, rows, fields) => {
        if (!err) {
            if (rows.length == 0) {
                response.status(200).send({
                    'rows': "nenhum"
                });
            } else {
                let usersF = [];
                for (let i = 0; i < rows.length; i++) {
                    hubspotController.verAtachemnts(rows[i].idcompanies, async (res) => {
                        if (res.anexos) {
                            var users = res.anexos;
                            usersF.push({
                                'url': users[0].url,
                                'idCompanie': rows[i].idcompanies,
                                'type': rows[i].tipoEmpresa,
                                'email': rows[i].email
                            })
                        } else {
                            usersF.push({
                                'url': '',
                                'idCompanie': rows[i].idcompanies,
                                'type': rows[i].tipoEmpresa,
                                'email': rows[i].email
                            })
                        }

                        //console.log(usersF.length);
                        if (usersF.length == rows.length) {
                            console.log(usersF);
                            response.status(200).send(usersF);
                        }
                    })
                }
            }
        } else {
            response.status(400).send(err);
        }
    })
}

function validarCompanies(request, response){
    const idCompanie = request.body.idCompanie;
    const email = request.body.email;

    connect.query(`UPDATE companies SET verificado = 1 WHERE idcompanies = ${idCompanie}`, (err, rows, fields) => {
        if(!err){
            response.status(200).send({
                'verificado': true
            })
            let bodycontent = `Olá caro utilizador, <br> <br>
            A sua conta acabou de ser verificada, a partir deste momento já pode aceder a ela, quando desejar! <br>
            <center><a href='https://wtransnet-face.herokuapp.com/login'><button type='button'>Aceder a Conta</button></a></center><br><br>`;

            const aceitar = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: process.env.MAIL_USER, // generated ethereal user
                  pass: process.env.MAIL_PASS, // generated ethereal password
                },
            })

            aceitar.verify(function (error, success) {
                if (error) {
                    response.status(400).send({
                        'message': "Can't send email",
                        'error': error
                    });
                } else {
                    const mailOptions = {
                        'from': {
                            'name': 'Wtransnet',
                            'address': process.env.MAIL_USER
                        },
                        'to': {
                            'name': `Cliente ${idCompanie}`,
                            'address': email
                        },
                        'subject': 'Validação da conta',
                        'html': bodycontent
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            response.status(400).send({
                                'message': "Can't send email",
                                'error': error
                            });
                        } else {
                            response.status(200).send({
                                'message': 'mail sent'
                            });
                        }
                    });
                }
            })
           
        } else {
            response.status(400).send({
                'verificado': false
            })
        }
    })
}

function recusarCompanie(request, response){

}


function registerCompanie(req, response) {
    //console.log(req);
    const email = req.body.properties.email;
    const nome = req.body.properties.company;
    const pass = req.body.properties.pass;
    const nif = req.body.properties.numero_de_identificacao_fiscal;
    const contacto = req.body.properties.phone;
    const tipo = req.body.properties.tipo;

    let passCripto = "";
    const hashPassword = async () => {
        const hash = await bCrypt.hash(pass, 10)
        passCripto = hash;
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
                                        pass: passCripto,
                                        tipoEmpresa: tipo
                                    }
                                    connect.query('INSERT INTO companies SET ?', post, (err, rows, fields) => {
                                        if (!err) {
                                            response.status(200).send({
                                                'body': {
                                                    'message': 'User inserted with success',
                                                    'id': res.body.user_id
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




function getProductsJ(response) {
    //console.log(request.body.properties.nif);
    jasminController.getProducts((res) => {
        if (res.statusCode == 200) {
            const users = res.products;
            response.status(res.statusCode).send(users.nome);

        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

function getCargas(rq, response) {
    connect.query(`SELECT * FROM carga WHERE comprador=0`, async(err, rows, fields) => {
        if(!err){
            response.status(200).send({
                'body': rows
            })
        }else{
            response.status(400).send({
                'body': err
            })
        }
    })
}

function getTransportes(req, response) {
    connect.query(`SELECT * FROM transporte WHERE comprador=0`, async(err, rows, fields) => {
        if(!err){
            response.status(200).send({
                'body': rows
            })
        }else{
            response.status(400).send({
                'body': err
            })
        }
    })
}

function login(request, response) {
    const email = request.body.email;
    const password = request.body.pass;
    const passValidation = async function (userpass, password) {
        return await bCrypt.compare(password, userpass);
    }
    connect.query(`SELECT * FROM companies WHERE email='${email}' and verificado='1'`, async (err, rows, fields) => {
        if (!err) {
            if (rows.length != 0) {
                const user = rows[0];
                if (await passValidation(user.pass, password)) {
                    if (user.verificado == true) {
                        let userF = {
                            user_id: user.idcompanies,
                            email: user.email,
                            nome: user.nome,
                            verificado: true,
                            tipo: user.tipoEmpresa
                        }
                        response.status(200).send(userF);
                    } else {
                        done(null, false, {
                            'message': `Utilizador não verificado`
                        })
                    }
                } else {
                    response.status(400).send({
                        'message': `Password Incorreta`
                    })
                }
            } else {
                response.status(400).send({
                    'message': `user not found`
                })
            }
        } else {
            response.status(400).send({ err });
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
    addFiles: addFiles,
    getProductsJ: getProductsJ,
    login: login,
    precisaValidacao: precisaValidacao,
    validarCompanies: validarCompanies,
    getCargas: getCargas,
    getTransportes: getTransportes
}