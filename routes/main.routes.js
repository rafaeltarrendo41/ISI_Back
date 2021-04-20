const router = require('express').Router();


const jasminController = require('../controllers/jasmin.controller');
const hubspotController = require('./../controllers/hubspot.controller');



router.get('/getCompanies', hubspotController.getCompanies);
router.post('/register', hubspotController.createCompanies);
router.get('/getToken', jasminController.getToken);
router.get('/retornar', jasminController.retornar);


module.exports = router;