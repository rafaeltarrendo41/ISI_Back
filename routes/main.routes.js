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
router.post('/createEngagement', hubspotController.createEngagement);
router.get('/precisaValidar', mainController.precisaValidacao);
router.post('/validarCompanie', mainController.validarCompanies);
router.post('/recusarCompanie', mainController.recusarCompanie);
router.get('/getCargas', mainController.getCargas);
router.get('/getTransportes', mainController.getTransportes);
router.post('/addDeal', hubspotController.addDeal);
router.get('/distancia', mainController.distancia);
router.post('/pagamentos', mainController.pagamentos);

router.post('/aceitarMatchCarga', mainController.aceitarMatchingCarga);
router.post('/aceitarMatchTrans', mainController.aceitarMatchingTrans);

router.get('/getToken', jasminController.getToken);
router.get('/retornar', jasminController.retornar);

router.get('/retornarMOLONI', moloniController.retornar);
router.get('/products', moloniController.getProducts); 
router.get('/getCompany', moloniController.getCompany);
router.get('/getCategory', moloniController.getCategory);
router.post('/insertClientMOLONI', moloniController.insertClientM);
router.post('/insertProductMOLONI', moloniController.insertProduct);
router.get('/getTokenMOLONI', moloniController.getToken);

router.get('/retornar', jasminController.retornar);
router.post('/insertClient', jasminController.insertClient);
router.post('/insertProductJASMIN', jasminController.insertProduct);
router.get('/getProductsJASMIN', mainController.getProductsJ);

module.exports = router;