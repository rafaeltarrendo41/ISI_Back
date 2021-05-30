const querystring = require('querystring');
const req = require('request');
const connect = require('./../config/dbConnection');




function getToken(callback) {
    let json = querystring.stringify({
        client_id: 'ISIWTRANSNET',
        client_secret: 'a5adfbbf-52cb-4066-b38c-e9b969f5f042',
        grant_type: 'client_credentials',
        scope: 'application'
    });

    let options = {
        headers: {
            'Content-Length': json.length,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: `https://identity.primaverabss.com/core/connect/token`,
        body: json
    }
    req.post(options, (err, res) => {
        if (!err && res.statusCode == 200) {
            callback({
                'access_token': JSON.parse(res.body).access_token
            });
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            });
        }
    })
}

function retornar() {
    getToken((res) => {
    console.log(res.access_token);
    })
    // getProducts((res) => {
    //     console.log("Aqui");
    // })
    // getMaterials((res) => {
    //     console.log(res);
    // })
    // getClient((res) => {
    //     console.log(res);
    // })
    // getInvoiceType((res) => {
    //     console.log(res);
    // })
    // getOrders((res) => {
    //     console.log(res);
    // })




}


function getProducts(callback) {
    getToken((res) => {
        if (res.access_token) {
            let access_token = res.access_token;

            let options = {
                headers: {
                    method: 'GET',
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                url: `https://my.jasminsoftware.com/api/252605/252605-0001/salesCore/salesItems`
            }
            req.get(options, (err, res, body) => {
                //console.log(res.body).results;
                if (!err && res.statusCode == 200) {
                    // let resp = JSON.parse(res.body);
                    const a = JSON.parse(body)
                    ///.log(resp);
                    var tamnho = Object.keys(a);
                    // console.log(res.body);
                    let produtos = [];
                    for (let i = 0; i < tamnho.length; i++) {
                        //console.log(resp[i]);
                        produtos.push({
                            'nome': a[i].itemKey,
                            'dataCriacao': a[i].createdOn
                        })
                    }
                    console.log(produtos);
                    callback({
                        'statusCode': 200,
                        'products': produtos
                    });

                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            });
        }
    })
}

function getClient(callback) {
    getToken((res) => {
        if (res.access_token) {
            let access_token = res.access_token;

            let options = {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                url: `${global.jasminUrl}salescore/customerParties`
            }
            req.get(options, (err, res) => {
                console.log(res.statusCode);
                console.log(res.body);
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    callback({
                        'Client': resp
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            });
        }
    })
}

function getOrders(callback) {
    getToken((res) => {
        if (res.access_token) {
            let access_token = res.access_token;

            let options = {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                url: `${global.jasminUrl}sales/orders`
            }
            req.get(options, (err, res) => {
                console.log(res.statusCode);
                console.log(res.body);
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    callback({
                        'Client': resp
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            });
        }
    })
}


function getInvoiceType(callback) {
    getToken((res) => {
        if (res.access_token) {
            const access_token = res.access_token;

            let options = {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                url: `${global.jasminUrl}salesCore/invoiceTypes`
            }
            req.get(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    let invoiceType;
                    for (let i = 0; i < resp.length; i++) {
                        if (resp[i].company == 'wtransnet' && resp[i].typeKey == 'FR') {
                            invoiceType = resp[i];
                        }
                    }
                    callback({
                        'invoiceType': invoiceType.documentTypeSeries[0],
                        'access_token': access_token
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        }
    })
}

/* function getPurchases(customer_id, callback) {
    getToken((res) => {
        if (res.access_token) {
            const access_token = res.access_token;

            let options = {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                url: `${global.jasminUrl}billing/invoices`
            }
            req.get(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let invoices = JSON.parse(res.body);
                    let invoicesF = [];
                    for (let i = 0; i < invoices.length; i++) {
                        if (invoices[i].buyerCustomerParty == customer_id && !invoices[i].isDeleted) {
                            invoicesF.push(invoices[i]);
                        }
                    }

                    callback({
                        'statusCode': res.statusCode,
                        'body': invoicesF
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': res.body
            })
        }
    })
}

*/

function insertClient(nome, callback) {
    console.log(nome.body);
    var nome1 = nome.body.nome;
    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIII" + nome1);
    getToken((res) => {
        if (res.access_token) {
            const access_token = res.access_token;

            const json = {
                'name': nome1,
                'companyTaxID': nome.body.companyTaxID,
                'isExternallyManaged': false,
                'currency': 'EUR',
                'isPerson': true,
                'country': 'PT'
            };
            console.log(json);
            let options = {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': JSON.stringify(json).length
                },
                url: `${global.jasminUrl}salescore/customerParties`,
                body: JSON.stringify(json)
                //body: json
            }
            req.post(options, (err, res) => {
                console.log(res.statusCode);
                if (!err && res.statusCode == 201) {
                    const record_id = JSON.parse(res.body);

                    options = {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        },
                        url: `${global.jasminUrl}salescore/customerParties/${record_id}`
                    }
                    req.get(options, (err, res) => {
                        if (!err && res.statusCode == 200) {
                            /*callback({
                                'statusCode': res.statusCode,
                                'body': {
                                    customer_id: JSON.parse(res.body).partyKey
                                }
                            })*/callback.status(200).send(res.body);
                        } else {
                            callback({
                                'statusCode': res.statusCode,
                                'body': res.body
                            })
                        }
                    })
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': res.body
                    })
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': res.body
            })
        }
    })
}

function insertProduct(nome, callback) {
    const post = {
        criador: nome.body.user_id,
        origem: nome.body.origem,
        destino: nome.body.destino,
        especialidade: nome.body.especialidade,
        peso: nome.body.peso
    }
    connect.query('INSERT INTO carga SET ?', post, (err, rows, fields) => {
        if (!err) {
            connect.query(`SELECT * FROM carga WHERE criador=${nome.body.user_id} AND origem="${nome.body.origem}" AND destino="${nome.body.destino}" AND especialidade="${nome.body.especialidade}" AND peso="${nome.body.peso}"`, async (err, rows, fields) => {
                const carga = rows[0];
                getToken((res) => {
                    if (res.access_token) {
                        const access_token = res.access_token;

                        const json = {
                            'unit': 'KG',
                            'itemTaxSchema': 'NORMAL',
                            'incomeAccount': '71111',
                            'locked': false,
                            'itemKey': carga.idCargas,
                            'description': nome.body.especialidade,
                            'isExternallyManaged': false,
                            'baseUnit': 'KG',
                            'itemType': 1
                        };
                        //console.log(json);
                        let options = {
                            headers: {
                                'Authorization': `Bearer ${access_token}`,
                                'Content-Type': 'application/json; charset=utf-8',
                                'Content-Length': JSON.stringify(json).length
                            },
                            url: `${global.jasminUrl}salescore/salesItems`,
                            body: JSON.stringify(json)
                            //body: json
                        }
                        console.log(options);
                        req.post(options, (err, res) => {
                            console.log(res.body);
                            if (!err && res.statusCode == 201) {
                                const record_id = JSON.parse(res.body);
                                callback.status(201).send({
                                    'message': "criado",
                                    'body': record_id
                                })
                             
                            } else {
                                console.log(res.statusCode)
                              callback.status(400).send({
                                    'message': "erro ao adicionar produto"
                                })
                            }
                        })
                    } else {
                        callback({
                            'statusCode': res.statusCode,
                            'body': res.body
                        })
                    }
                })

            })
        } else {
            callback.status(400).send({
                'body': {
                    'message': err
                }
            })
        }
    })


}


module.exports = {
    getToken: getToken,
    retornar: retornar,
    //getPurchases: getPurchases,
    insertClient: insertClient,
    getProducts: getProducts,
    getInvoiceType: getInvoiceType,
    // getTeste: getTeste,
    insertProduct: insertProduct
};

