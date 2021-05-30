const bCrypt = require('bcryptjs');
const connect = require('./../config/dbConnection');
const req = require('request');
const nodemailer = require('nodemailer');
const distance = require('google-distance-matrix');

const hubspotController = require('./hubspot.controller');
const jasminController = require('./jasmin.controller');
const moloniController = require('./moloni.controller');
const { response } = require('../server');

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

// setInternal(
function distancia(request, response) {
    connect.query(`TRUNCATE TABLE matching;`);
    connect.query(`SELECT * FROM carga WHERE comprador=0`, (err, rows, fields) => {
        if (!err) {
            var carga = rows;
            connect.query(`SELECT * FROM transporte WHERE comprador=0`, (err, rows, fields) => {
                if (!err) {
                    var transporte = rows;
                    var resultados = []
                    for (let a = 0; a < transporte.length; a++) {
                        for (let i = 0; i < carga.length; i++) {
                            if (carga[i].origem == transporte[a].origem && carga[i].destino == transporte[a].destino && carga[i].especialidade == transporte
                            [a].especialidade && carga[i].peso <= transporte[a].peso) {
                                resultados.push({
                                    'idCarga': carga[i].idCargas,
                                    'idTransporte': transporte[a].idtransporte,
                                    'criadorCarga': carga[i].criador,
                                    'criadorTransporte': transporte[a].criador,
                                    'origem': carga[i].origem,
                                    'destino': carga[i].destino,
                                    'especialidade': carga[i].especialidade,
                                    'peso': carga[i].peso
                                })
                            }
                        }
                    }

                    for (let i = 0; i < resultados.length; i++) {
                        connect.query(`SELECT email FROM companies WHERE idcompanies=${resultados[i].criadorCarga} OR idcompanies=${resultados[i].criadorTransporte}`, (err, rows, fields) => {
                            if (!err) {
                                const dados = {
                                    'idCarga': resultados[i].idCarga,
                                    'idTransporte': resultados[i].idTransporte
                                }
                                connect.query(`INSERT INTO matching SET ?`, dados, (err, rows7) => {

                                    connect.query(`SELECT idmatching FROM matching WHERE idCarga=${resultados[i].idCarga} AND idTransporte=${resultados[i].idTransporte}`, dados, (err, rows1) => {
                                        if (!err) {
                                            console.log(rows1);
                                            const matching = rows1[0].idmatching;
                                            //const matching = 10
                                            console.log(matching);



                                            let bodycontentCarga = ` <head> <style> button {background-color: #02475e; color: #fff } </style> </head> <body> <img src="https://github.com/rafaeltarrendo41/ISI/blob/main/Templates/uploads_sites/2/2016_01/wtransnet_logo.png?raw=true">
                                            <br> <br> 
                                            <form> Caro utilizador, <br> <br>
            Uma das suas cargas publicadas no nosso serviço acabou de fazer matching com um transporte!  <br>
            Seguem em seguida as caracteristicas do transporte: <br>
            Origem: ${resultados[i].origem} <br>
            Destino: ${resultados[i].destino} <br>
            Especialidade: ${resultados[i].especialidade}<br>
            Toneladas: ${resultados[i].peso}<br>
            Caso deseje aceitar este matching, entre no próximo link para executar os próximos passos da realização deste serviço <br>
            Este link apenas será válido durante 15 min<br>
            <center><a href='https://wtransnet-face.herokuapp.com/matchCarga?idMatch=${matching}'><button type='button'>Aceder</button></a></center><br><br>
            Caso não consiga utilizar o botão click no seguinte link: https://wtransnet-face.herokuapp.com/matchCarga?idMatch=${matching} <br><br>`;

                                            let bodycontentTransporte = ` <head> <style> button {background-color: #02475e; color: #fff} </style> </head> <body> <img src="https://github.com/rafaeltarrendo41/ISI/blob/main/Templates/uploads_sites/2/2016_01/wtransnet_logo.png?raw=true">
                                            <br> <br> 
                                            <form> Caro utilizador, <br> <br>
            Um dos seus tarnsportes publicados no nosso serviço acabou de fazer matching com uma carga!  <br>
            Seguem em seguida as caracteristicas da carga: <br>
            Origem: ${resultados[i].origem} <br>
            Destino: ${resultados[i].destino} <br>
            Especialidade: ${resultados[i].especialidade}<br>
            Toneladas: ${resultados[i].peso}<br>
            Caso deseje aceitar este matching, entre no próximo link para executar os próximos passos da realização deste serviço <br>
            Este link apenas será válido durante 15 min<br>
            <center><a href='https://wtransnet-face.herokuapp.com/matchTransporte?idMatch=${matching}'><button type='button'>Aceder</button></a></center><br><br>
            Caso não consiga utilizar o botão click no seguinte link: https://wtransnet-face.herokuapp.com/matchTransporte?idMatch=${matching} <br><br>`;

                                            const enviar = nodemailer.createTransport({
                                                service: 'gmail',
                                                host: `smtp.gmail.com`,
                                                auth: {
                                                    user: process.env.MAIL_USER, // generated ethereal user
                                                    pass: process.env.MAIL_PASS, // generated ethereal password
                                                }
                                            })


                                            const mailOptions1 = {
                                                from: {
                                                    'name': 'Wtransnet',
                                                    'address': process.env.MAIL_USER
                                                },
                                                to: {
                                                    'address': rows[0].email
                                                },
                                                subject: 'Proposta de matching',
                                                html: bodycontentTransporte
                                            };

                                            const mailOptions = {
                                                from: {
                                                    'name': 'Wtransnet',
                                                    'address': process.env.MAIL_USER
                                                },
                                                to: {
                                                    'address': rows[1].email
                                                },
                                                subject: 'Proposta de matching',
                                                html: bodycontentCarga
                                            };
                                            enviar.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    response.status(400).send({
                                                        'verificado': false,
                                                        'message': "Can't send email",
                                                        'error': error
                                                    });
                                                } else {
                                                    response.status(200).send({
                                                        'verificado': true,
                                                        'message': 'mail sent'
                                                    });
                                                }
                                            });
                                            enviar.sendMail(mailOptions1, function (error, info) {
                                                if (error) {
                                                    response.status(400).send({
                                                        'verificado': false,
                                                        'message': "Can't send email",
                                                        'error': error
                                                    });
                                                } else {
                                                    response.status(200).send({
                                                        'verificado': true,
                                                        'message': 'mail sent'
                                                    });
                                                }
                                            });
                                        } else {
                                            console.log(err);
                                        }
                                    })
                                })

                            }
                        })
                    }


                    if (resultados.length != 0) {
                        response.status(200).send(resultados);
                    } else {
                        response.status(200).send({
                            'message': 'nenhum match'
                        })
                    }

                } else {
                    response.status(400).send(err)
                }
            })
        } else {
            response.status(400).send(err)
        }
    })
}
// , 1000*60*15);


function aceitarMatchingTrans(request, res) {
    connect.query(`UPDATE matching SET transporteaceitou=1 WHERE idmatching=${request.body.idmatching}`, (err, rows) => {
        //console.log(rows)
        if (!err) {
            connect.query(`SELECT * FROM matching WHERE idmatching=${request.body.idmatching} and cargaAceitou=1 and transporteaceitou=1`, (err, rows1) => {
                if (rows1.length != 0) {
                    connect.query(`SELECT criador FROM carga WHERE idCargas=${rows1[0].idCarga}`, (err, rows2) => {
                        //console.log(rows2)
                        if (!err) {
                            const criadorC = {
                                'comprador': rows2[0].criador
                            }
                            connect.query(`SELECT criador FROM transporte WHERE idtransporte=${rows1[0].idTransporte}`, (err, rows3) => {
                                if (!err) {
                                    const criadorT = {
                                        'comprador': rows3[0].criador
                                    }

                                    connect.query(`UPDATE carga SET ? WHERE idCargas=${rows1[0].idCarga}`, criadorT, (err, rows4) => {
                                        // console.log(err)
                                    });
                                    connect.query(`UPDATE transporte SET ?  WHERE idTransporte=${rows1[0].idTransporte}`, criadorC, (err, rows5) => {
                                        //console.log(err)
                                    });

                                    res.status(200).send({
                                        'message': 'match aceite por ambos'
                                    })

                                }
                            })
                        }
                    })
                } else {
                    res.status(200).send({
                        'message': 'match aceite'
                    })
                }
            })
        } else {
            res.status(400).send({
                'message': 'match n aceite'
            })
        }
    })
}

function aceitarMatchingCarga(request, res) {
    connect.query(`UPDATE matching SET cargaAceitou=1 WHERE idmatching=${request.body.idmatching}`, (err, rows) => {
        if (!err) {
            connect.query(`SELECT * FROM matching WHERE idmatching=${request.body.idmatching} and cargaAceitou=1 and transporteaceitou=1`, (err, rows1) => {
                if (rows1.length != 0) {
                    connect.query(`SELECT criador FROM carga WHERE idCargas=${rows1[0].idCarga}`, (err, rows2) => {
                        //console.log(rows2)
                        if (!err) {
                            const criadorC = {
                                'comprador': rows2[0].criador
                            }
                            connect.query(`SELECT criador FROM transporte WHERE idtransporte=${rows1[0].idTransporte}`, (err, rows3) => {
                                if (!err) {
                                    const criadorT = {
                                        'comprador': rows3[0].criador
                                    }

                                    connect.query(`UPDATE carga SET ? WHERE idCargas=${rows1[0].idCarga}`, criadorT, (err, rows4) => {
                                        // console.log(err)
                                    });
                                    connect.query(`UPDATE transporte SET ?  WHERE idTransporte=${rows1[0].idTransporte}`, criadorC, (err, rows5) => {
                                        //console.log(err)
                                    });


                                    res.status(200).send({
                                        'message': 'match aceite por ambos'
                                    })

                                }
                            })
                        }
                    })
                } else {
                    res.status(200).send({
                        'message': 'match aceite'
                    })
                }
            })
        } else {
            res.status(400).send({
                'message': 'match n aceite'
            })
        }
    })
}

function pagamentos(request, response) {
    connect.query(`SELECT tipoEmpresa FROM companies WHERE idcompanies=${request.body.idCompanie}`, (error, rows) => {
        if (rows.length != 0) {
            if (rows[0].tipoEmpresa == "Transportadora") {
                connect.query(`SELECT idCargas as idCompra, origem, destino, especialidade,peso FROM carga WHERE comprador=${request.body.idCompanie} AND idVenda=0`, (err, rows1) => {
                    if (!err) {
                        response.status(200).send(rows1);
                    } else {
                        response.status(400).send();
                    }
                })
            } else {
                connect.query(`SELECT idTransporte as idCompra, origem, destino, especialidade,peso FROM transporte WHERE comprador=${request.body.idCompanie} AND idVenda=0`, (err, rows1) => {
                    if (!err) {
                        response.status(200).send(rows1);
                    } else {
                        response.status(400).send();
                    }
                })
            }
        } else {
            response.status(400).send(error)
        }
    })
}

function pagar(request, response) {
    const compraID = request.body.compraID;
    const companieID = request.body.companie_id;
    // console.log(request)
    moloniController.insertInvoice(companieID, (res) => {
        console.log(res.fatura.valid)
        if (res.fatura.valid == "1") {
            const idVenda = res.fatura.document_id;
            connect.query(`SELECT tipoEmpresa FROM companies WHERE idcompanies=${companieID}`, (err, rows) => {
                if (rows[0].tipoEmpresa == "Transportadora") {
                    connect.query(`UPDATE carga SET idVenda=${idVenda} WHERE idCargas=${compraID}`, (err, rows1) => {
                        if (!err) {
                            response.status(200).send({
                                'message': 'pago'
                            });
                        } else {
                            console.log(err)
                            response.status(400).send({
                                'message': 'erro bd'
                            });
                        }
                    })
                } else {
                    connect.query(`UPDATE transporte SET idVenda=${idVenda} WHERE idTransporte=${compraID}`, (err, rows1) => {
                        if (!err) {
                            response.status(200).send({
                                'message': 'pago'
                            });
                        } else {
                            console.log(err)
                            response.status(400).send({
                                'message': 'erro bd'
                            });
                        }

                    })
                }
            })


        } else {
            response.status(400).send({
                'message': 'erro'
            })
        }
    })
}

function addFiles(request, response) {
    console.log("aqui")
    var a = request.body;
    console.log(a);
    hubspotController.addFiles(request.body.filename, (res) => {
        if (res.statusCode == 200) {
            const fileId = res.body;
            console.log(fileId);

            const a = {
                companieID: request.body.companieId,
                fileId: fileId
            }

            console.log(a);

            hubspotController.createEngagement(a, (resp) => {
                if (resp.statusCode == 200) {
                    response.status(200).send({
                        'resposta': "ficheiro adicionado"
                    })
                } else {
                    response.sendStatus(resp.statusCode).send({
                        'resposta': "ficheiro  n adicionado"
                    })
                }
            })
            // response.sendStatus(res.statusCode).send({
            //     'resposta': fileId
            // })
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
                                'email': rows[i].email,
                                'nif': rows[i].nif
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

function validarCompanies(request, response) {
    const idCompanie = request.body.idCompanie;
    const email = request.body.email;
    const nif = request.body.nif;

    connect.query(`UPDATE companies SET verificado = 1 WHERE idcompanies = ${idCompanie}`, (err, rows, fields) => {
        if (!err) {
            // response.status(200).send({
            //     'verificado': true
            // })
            let bodycontent = `<head> <style> button {background-color: #02475e; color: #fff} </style> </head> <body> <img src="https://github.com/rafaeltarrendo41/ISI/blob/main/Templates/uploads_sites/2/2016_01/wtransnet_logo.png?raw=true">
            <br> <br> 
            <form>
            Bem vindo à Wtransnet, <br> <br>
            A sua conta acabou de ser verificada e a partir deste momento poderá usufruir dos nossos serviços! <br>
            <a href='https://wtransnet-face.herokuapp.com/login'> <br> <button type='button'>Aceder</button></a><br><br>
            Caso não consiga utilizar o botão click no seguinte link: https://wtransnet-face.herokuapp.com/login <br><br>`;


            const aceitar = nodemailer.createTransport({
                service: 'gmail',
                host: `smtp.gmail.com`,
                auth: {
                    user: process.env.MAIL_USER, // generated ethereal user
                    pass: process.env.MAIL_PASS, // generated ethereal password
                }
            })


            const mailOptions = {
                from: {
                    'name': 'Wtransnet',
                    'address': process.env.MAIL_USER
                },
                to: {
                    'name': `Cliente ${idCompanie}`,
                    'address': email
                },
                subject: 'Validação da conta',
                html: bodycontent
            };
            aceitar.sendMail(mailOptions, function (error, info) {
                if (error) {
                    response.status(400).send({
                        'verificado': false,
                        'message': "Can't send email",
                        'error': error
                    });
                } else {
                    const properties = {
                        nif: nif,
                        nome: idCompanie,
                        email: email
                    }
                    moloniController.insertClientM(properties, (res) => {
                        console.log(res.inserido)
                        if (res.inserido) {
                            response.status(200).send({
                                'verificado': true,
                                'message': 'mail sent'
                            });
                        } else {
                            response.status(400).send({
                                'verificado': false,
                                'message': 'erro moloni'
                            });
                        }


                    })


                }
            });


        } else {
            response.status(400).send({
                'verificado': false
            })
        }
    })
}

function recusarCompanie(request, response) {
    const idCompanie = request.body.idCompanie;
    const email = request.body.email;


    let bodycontent = ` <head> <style> button {background-color: #02475e; color: #fff} </style> </head> <body> <img src="https://github.com/rafaeltarrendo41/ISI/blob/main/Templates/uploads_sites/2/2016_01/wtransnet_logo.png?raw=true">
    <br> <br> 
    <form> Caro utilizador, <br> <br>
    Após realizarmos a verificação dos dados relativos à sua conta, verificamos que os documentos submtidos não são válidos. Pedimos assim que efetue um novo registo com as mesmas credenciais. Obrigado!
    <br>
    <center><a href='https://wtransnet-face.herokuapp.com/loginRecusados'><button type='button'>Aceder</button></a></center><br><br>
    Caso não consiga utilizar o botão click no seguinte link: https://wtransnet-face.herokuapp.com/loginRecusados <br><br>`;

    const aceitar = nodemailer.createTransport({
        service: 'gmail',
        host: `smtp.gmail.com`,
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        }
    })


    const mailOptions = {
        from: {
            'name': 'Wtransnet',
            'address': process.env.MAIL_USER
        },
        to: {
            'name': `Cliente ${idCompanie}`,
            'address': email
        },
        subject: 'Validação da conta',
        html: bodycontent
    };
    aceitar.sendMail(mailOptions, function (error, info) {
        if (error) {
            response.status(400).send({
                'verificado': false,
                'message': "Can't send email",
                'error': error
            });
        } else {
            hubspotController.removeClient(idCompanie, (res)=>{
                if(res.statusCode == 200){
                    connect.query(`DELETE FROM companies WHERE idcompanies=${idCompanie}`,(err, rows, fields) =>{
                        if(!err){
                            response.status(200).send({
                                'verificado': true,
                                'message': 'mail sent'
                            });
                        }
                    })
                }
            })
            
        }
    });

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
                                        tipoEmpresa: tipo,
                                        nif: nif
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






function getProductsJ(request,response) {
    //console.log(request.body.properties.nif);
    jasminController.getProducts((res) => {
        if (res.statusCode == 200) {
            const users = res.products;
            response.status(200).send({
                'cargas':users});

        } else {
            response.status(400).send(users);
        }
    })
}

function getProductsM(request, response){
    moloniController.getProducts((res) => {
        if (res.statusCode == 200) {
            const users = res.body;
            response.status(200).send({
                'cargas':users});

        } else {
            response.status(400).send(users);
        }
    })
}

function getCargas(rq, response) {
    connect.query(`SELECT * FROM carga WHERE comprador=0`, async (err, rows, fields) => {
        if (!err) {
            response.status(200).send({
                'body': rows
            })
        } else {
            response.status(400).send({
                'body': err
            })
        }
    })
}

function getTransportes(req, response) {
    connect.query(`SELECT * FROM transporte WHERE comprador=0`, async (err, rows, fields) => {
        if (!err) {
            response.status(200).send({
                'body': rows
            })
        } else {
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

function verDocumentos(request, response) {
    const companie_id = request.body.companieID;

    connect.query(`SELECT tipoEmpresa FROM companies WHERE idcompanies=${companie_id}`, (error, rows) => {
        if (rows.length != 0) {
            let documentos = []
            if (rows[0].tipoEmpresa == "Transportadora") {
                connect.query(`SELECT * FROM carga WHERE comprador=${companie_id} AND idVenda!=0`, (err, rows1) => {
                    if (!err) {
                        if (rows1.length != 0) {
                            for (let i = 0; i < rows1.length; i++) {
                                moloniController.getPDFLink(rows1[i].idVenda, (res) => {
                                    documentos.push({
                                        'origem': rows1[i].origem,
                                        'destino': rows1[i].destino,
                                        'especialidade': rows1[i].especialidade,
                                        'ton': rows1[i].peso,
                                        'fatura': res.body
                                    })

                                    if (documentos.length == rows1.length) {
                                        console.log(documentos);
                                        response.status(200).send(documentos);
                                    }
                                })
                            }
                        }
                    } else {
                        response.status(400).send();
                    }
                })
            } else {
                connect.query(`SELECT * FROM transporte WHERE comprador=${companie_id} AND idVenda!=0`, (err, rows1) => {
                    if (!err) {
                        if (rows1.length != 0) {
                            console.log(rows1.length)
                            for (let i = 0; i < rows1.length; i++) {
                                moloniController.getPDFLink(rows1[i].idVenda, (res) => {
                                    documentos.push({
                                        'origem': rows1[i].origem,
                                        'destino': rows1[i].destino,
                                        'especialidade': rows1[i].especialidade,
                                        'ton': rows1[i].peso,
                                        'fatura': res.body
                                    })

                                    if (documentos.length == rows1.length) {
                                        response.status(200).send(documentos);
                                    }
                                })
                            }
                        }
                    } else {
                        response.status(400).send();
                    }
                })
            }
        } else {
            response.status(400).send(error)
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
    recusarCompanie: recusarCompanie,
    getCargas: getCargas,
    getTransportes: getTransportes,
    distancia: distancia,
    aceitarMatchingCarga: aceitarMatchingCarga,
    aceitarMatchingTrans: aceitarMatchingTrans,
    pagamentos: pagamentos,
    pagar: pagar,
    verDocumentos: verDocumentos,
    getProductsM: getProductsM
}