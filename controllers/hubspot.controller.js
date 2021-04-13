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
            limit: '',
            archived: 'false',
            hapikey: process.env.HUBSPOT_KEY
        },
        headers: {
            accept: 'application/json',
            authorization: 'Bearer 3e91d9c4-cd74-452b-8f40-4aeb8457e911'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

module.exports = {
    getCompanies: getCompanies
}