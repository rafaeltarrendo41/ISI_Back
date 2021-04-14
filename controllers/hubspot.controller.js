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
            authorization: 'Bearer '+ process.env.HUBSPOT_KEY
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