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

/*
POST
Função que permite criar clientes no Hubspot
*/

function postCompanies(callback) {
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
            authorization: 'Bearer '+ process.env.HUBSPOT_KEY
        },
        body: {
            //inserir atributos necessarios para a criaçao da empresa e ir buscar as variaveis
            properties: {city: '', domain: '', industry: '', name: '', phone: '', state: '', VAT: ''}
        },
        json: true
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
      });
}

/*
PATCH
Função que permite atualizar os clientes no Hubspot através do companyId
*/

function updateCompanies(callback) {
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
            authorization: 'Bearer '+ process.env.HUBSPOT_KEY
        },
        body: {
            //inserir atributos necessarios para a criaçao da empresa e ir buscar as variaveis
            properties: {city: '', domain: '', industry: '', name: '', phone: '', state: '', VAT: ''}
        },
        json: true
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
      });
}

module.exports = {
    getCompanies: getCompanies,
    postCompanies: postCompanies,
    updateCompanies:updateCompanies
}