const bCrypt = require('bcryptjs');
const connect = require('./../config/dbConnection');
const req = require('request');

const hubspotController = require('./hubspot.controller');

function getCompanies(request, response) {
    hubspotController.getCompanies((res) => {
        if (res.users) {
            const users = res.users;
            let usersF = [];

            response.status(200).send({
                'users': users
            })

        } else {
            response.status(res.statusCode).send(res.body);
        }
    })
}

function createCompanie(request, response) {
    // const req = request;
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
module.exports = {
    getCompanies: getCompanies,
    createCompanie: createCompanie
}