const router = require('express').Router();

const hubspotController = require('./../controllers/hubspot.controller');


router.get('/getCompanies', hubspotController.getCompanies);
router.post('/register', hubspotController.createCompanies);

module.exports = router;