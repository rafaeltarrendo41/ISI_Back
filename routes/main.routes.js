const router = require('express').Router();


const jasminController = require('../controllers/jasmin.controller');
const moloniController = require('../controllers/moloni.controller');
const hubspotController = require('./../controllers/hubspot.controller');
const mainController = require('./../controllers/main.controller');


router.get('/getCompanies', mainController.getCompanies);
//router.post('/register', mainController.createCompanie);
router.post('/register', mainController.registerCompanie);
router.post('/login', mainController.login);
router.patch('/updateCompanie', mainController.updateCompanie);
router.get('/exitsNif', mainController.existeNif);
router.get('/verAttachments', mainController.verAtachemnts);
router.post('/addFiles', mainController.addFiles);
router.get('/getToken', jasminController.getToken);
router.get('/retornar', jasminController.retornar);

router.get('/retornarMOLONI', moloniController.retornar);
router.get('/products', moloniController.getProducts); 
router.get('/getCompany', moloniController.getCompany);
router.get('/getCategory', moloniController.getCategory);

router.post('/cona', moloniController.insertClientM);
router.post('/insertProductMOLONI', moloniController.insertProduct);

router.get('/retornar', jasminController.retornar);
router.post('/insertClient', jasminController.insertClient);
router.post('/insertProductJASMIN', jasminController.insertProduct);

module.exports = router;