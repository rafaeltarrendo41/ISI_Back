var request = require("request");

/*
Função que permite ir buscar todos so clientes ao Hubspot
*/

/* https://www.npmjs.com/package/@hubspot/api-client */

function getCompanies(callback) {
    var options = {
        method: 'GET',
        url: 'https://api.hubapi.com/crm/v3/objects/companies',
        qs: {
            limit: '100',
            properties: 'numero_de_identificacao_fiscal,name',
            archived: 'false',
            hapikey: process.env.HUBSPOT_KEY
        },
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + process.env.HUBSPOT_KEY
        }
    };

    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                const users = JSON.parse(response.body).companies;


                let usersF = [];
                for (let i = 0; i < users.lenght; i++) {
                    usersF.push[i]({
                        'id': users[i].numero_de_identificacao_fiscal,
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
    let json = {
        'properties': properties
    };

    var options = {
        method: 'POST',
        url: 'https://api.hubapi.com/crm/v3/objects/companies',
        qs: {
            limit: '',
            archived: 'false',
            hapikey: process.env.HUBSPOT_KEY
        },
        headers: {
            accept: 'application/json', 'content-type': 'application/json',
            authorization: 'Bearer ' + process.env.HUBSPOT_KEY
        },
        body: json.stringify(json)
    };

    req.post(options, (err, res) => {
        if (!err && res.statusCode == 200) {
            callback({
                'statusCode': 200,
                body: {
                    'user_id': JSON.parse(res.body).id
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            })
        }
    })
}

/*
PATCH
Função que permite atualizar os clientes no Hubspot através do companyId
*/

function updateCompanies(user_id, properties, callback) {
    let json = {
        'properties': properties
    }

    var options = {
        method: 'PATCH',
        url: 'https://api.hubapi.com/crm/v3/objects/companies/5860045128',
        qs: {
            limit: '',
            archived: 'false',
            hapikey: process.env.HUBSPOT_KEY
        },
        headers: {
            accept: 'application/json', 'content-type': 'application/json',
            authorization: 'Bearer ' + process.env.HUBSPOT_KEY
        },
        body: JSON.stringify(json)
    };

    req.post(options, (err, res) => {
        if (!err && res.statusCode == 204) {
            callback({
                'statusCode': 200,
                'body': {
                    'message': 'Updated with sucess'
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            })
        }
    })
}
function existsNIF(nif, callback){

}
module.exports = {
    getCompanies: getCompanies,
    createCompanies: createCompanies,
    updateCompanies: updateCompanies,
    existsNIF: existsNIF
}
