//const { application } = require("express");
//const { response } = require("express");
var request = require("request");
var fs = require('fs');
const { connected } = require("process");
const connection = require('./../config/dbConnection');

/*
Função que permite ir buscar todos so clientes ao Hubspot
*/

/* https://www.npmjs.com/package/@hubspot/api-client */

function getCompanies(callback) {
    let options = {
        url: `https://api.hubapi.com/crm/v3/objects/companies?limit=100&properties=contacts%2Cnumero_de_identificacao_fiscal%2Cname&archived=false&hapikey=${process.env.HUBSPOT_KEY}`
    }

    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                const users = JSON.parse(response.body).results;
                var tamanho = Object.keys(users);
                let usersF = [];
                for (let i = 0; i < tamanho.length; i++) {
                    usersF.push({
                        'id': users[i].id,
                        'nif': users[i].properties.numero_de_identificacao_fiscal,
                        'name': users[i].properties.name,
                    })
                }
                callback({
                    users: usersF
                })

            } else {
                callback({
                    'statusCode': response.statusCode,
                    'body': JSON.parse(response.body)
                })
            }
        } else {
            console.log(error),
                callback({
                    'statusCode': 400,
                    'body': 'erro'
                })
        }

    })
}

/*
POST
Função que permite criar clientes no Hubspot
*/

function createCompanies(properties, callback) {
    let json = properties;

    var options = {
        method: 'POST',
        url: 'https://api.hubapi.com/crm/v3/objects/companies',
        qs: { hapikey: process.env.HUBSPOT_KEY },
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: json,
        json: true
    };

    request.post(options, function (err, res) {
        if (!err && res.statusCode == 201) {
            callback({
                'statusCode': 200,
                'body': {
                    'user_id': (res.body).id
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

/*
PATCH
Função que permite atualizar os clientes no Hubspot através do companyId
*/

function updateCompanies(user_id, properties, callback) {
    let json = properties;
    console.log(user_id);

    var options = {
        method: 'PATCH',
        url: `https://api.hubapi.com/crm/v3/objects/companies/${user_id.idCompanie}`,
        qs: {
            hapikey: process.env.HUBSPOT_KEY
        },
        headers: {
            accept: 'application/json', 'content-type': 'application/json'
        },
        body: {
            properties: json
        },
        json: true
    };
    console.log(options);
    request.patch(options, function (err, res) {
        if (!err && res.statusCode == 200) {
            callback({
                'statusCode': 200,
                'body': {
                    'message': 'Updated with sucess'
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

/* 
Verificar se o NIF ja existe
*/
function existsNIF(nif, callback) {
    var existe = 0;
    getCompanies((res) => {
        if (res.users) {
            const users = res.users;
            for (let i = 0; i < users.length; i++) {
                if (nif == users[i].nif) {
                    existe++;
                }
            }
            if (existe == 0) {
                callback({
                    "statusCode": 200,
                    "existe": false
                })
            } else {
                callback({
                    "statusCode": 400,
                    "existe": true
                })
            }
        }
    })
}

/* 
Visualizar atachments
*/
function verAtachemnts(idCompanie, callback) {
    let options = {
        url: `https://api.hubapi.com/engagements/v1/engagements/associated/COMPANY/${idCompanie}/paged?hapikey=${process.env.HUBSPOT_KEY}&limit=100`
    }

    request.get(options, function (err, res, body) {
        if (!err) {
            if (res.statusCode == 200) {
                const anexos = JSON.parse(res.body).results;
                const indice = anexos.length - 1;
                console.log(indice);
                var urlAnexos = []
                urlAnexos.push({
                    'url': anexos[indice].attachments[0].id
                })


                callback({
                    anexos: urlAnexos
                })

            } else {
                callback({
                    'statusCode': res.statusCode,
                    'body': JSON.parse(res.body)
                })
            }

        } else {
            console.log(err);
            callback({
                'statisCode': 400,
                'body': 'erro'
            })
        }
    })
}
function addFiles(file, callback) {
    var postUrl = `https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=${process.env.HUBSPOT_KEY}`;

    var filename = 'CAE.pdf'

    var fileOptions = {
        access: 'PUBLIC_INDEXABLE',
        ttl: 'P3M',
        overwrite: false,
        duplicateValidationStrategy: 'NONE',
        duplicateValidationScope: 'ENTIRE_PORTAL'
    };

    var formData = {
        file: file,
        options: JSON.stringify(fileOptions),
        folderPath: 'docs'
    };

    request.post({
        url: postUrl,
        formData: file.file
    }, function optionalCallback(err, httpResponse, body, id) {
        const a = JSON.parse(body);
        const b = a.objects[0].id
        if (!err) {
            callback.status(200).send({
                'statusCode': 200,
                'body': b
            })
        } else {
            callback({
                'statusCode': 400,
                'body': err
            })
        }

    });


}

function createEngagement(req, callback) {
    const companieId = req.companieId;
    const fileId = req.fileId;

    var options = {
        method: 'POST',
        url: 'https://api.hubapi.com/engagements/v1/engagements',
        qs: { hapikey: process.env.HUBSPOT_KEY },
        headers:
            { 'Content-Type': 'application/json' },
        body:
        {
            engagement:
            {
                active: true,
                ownerId: 1,
                type: 'NOTE',
                timestamp: 1409172644778
            },
            associations:
            {
                contactIds: [],
                companyIds: [companieId],
                dealIds: [],
                ownerIds: []
            },
            attachments: [{ id: fileId }],
            metadata: { body: 'Anexo Adicionado' }
        },
        json: true
    };

    request(options, function (error, res, body) {
        if (!error) {
            callback({
                'statusCode': res.statusCode,
                'body': body
            })
        } else {
            callback({
                'statusCode': 400,
                'body': error
            })
        }
    })
}

function addDeal(callback) {
    // const associatedV = request.companieID;
    // const associatedC = require.CompradorID;
    // const cargaID = request.cargaID;
    // var currentDate = new Date()
    // var day = currentDate.getDate()
    // var month = currentDate.getMonth() + 1
    // var year = currentDate.getFullYear()
    // const today = day+'/'+month+'/'+year 
    // console.log(today);
    const associatedC = 6068324512;
    const associatedV = 6068324512;
    const cargaID = 35;
    const carga = true;


    var options = {
        method: 'POST',
        url: 'https://api.hubapi.com/deals/v1/deal',
        qs: { hapikey: process.env.HUBSPOT_KEY },
        headers:
            { 'Content-Type': 'application/json' },
        body:
        {
            associations: { associatedCompanyIds: [associatedV], associatedVids: [] },
            properties:
                [{ value: cargaID, name: 'dealname' },
                { value: 'closedwon', name: 'dealstage' },
                { value: 'default', name: 'pipeline' },
                //{ value: today, name: 'closedate' },
                { value: '250', name: 'amount' },
                { value: 'newbusiness', name: 'dealtype' }]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(response.statusCode);
        if (response.statusCode == 200) {
            if (carga) {
                connection.query(`UPDATE carga SET comprador=${associatedC}, idVenda=${body.dealId} WHERE idCargas=${cargaID}`, async (err, rows) => {
                    if (!err) {
                        callback({
                            'statusCode': 200,
                            'message': 'deal criado'
                        })
                    } else {
                        callback({
                            'statusCode': 400,
                            'message': 'deal n criado bd'
                        })
                    }
                })
            } else {
                connection.query(`UPDATE transporte SET comprador=${associatedC}, idVenda=${body.dealId} WHERE idCargas=${cargaID}`, async (err, rows) => {
                    if (!err) {
                        callback({
                            'statusCode': 200,
                            'message': 'deal criado'
                        })
                    } else {
                        callback({
                            'statusCode': 400,
                            'message': 'deal n criado bd'
                        })
                    }
                })
            }
        } else {
            callback.status(400).send({
                'message': 'erro ao criar deal'
            })
        }

    })
}
module.exports = {
    getCompanies: getCompanies,
    createCompanies: createCompanies,
    updateCompanies: updateCompanies,
    existsNIF: existsNIF,
    verAtachemnts: verAtachemnts,
    addFiles: addFiles,
    createEngagement: createEngagement,
    addDeal: addDeal
}
