const router = require('express').Router();

const hubspotController = require('./../controllers/hubspot.controller');


router.get('/getCompanies', hubspotController.getCompanies);

module.exports = router;