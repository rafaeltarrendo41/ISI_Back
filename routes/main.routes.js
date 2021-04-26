const router = require('express').Router();


const jasminController = require('../controllers/jasmin.controller');
const hubspotController = require('./../controllers/hubspot.controller');
const mainController = require('./../controllers/main.controller');



router.get('/getCompanies', mainController.getCompanies);
router.post('/register', mainController.registerCompanie);
router.patch('/updateCompanie', mainController.updateCompanie);
router.get('/exitsNif', mainController.existeNif);
router.get('/verAttachments', mainController.verAtachemnts);
router.post('/addFiles', mainController.addFiles);
router.get('/getToken', jasminController.getToken);
router.get('/retornar', jasminController.retornar);


module.exports = router;