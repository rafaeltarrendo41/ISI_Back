const router = require('express').Router();

const hubspotController = require('./../controllers/hubspot.controller');
const mainController = require('./../controllers/main.controller');


router.get('/getCompanies', mainController.getCompanies);
router.post('/register', mainController.createCompanie);

module.exports = router;