var express = require('express');
const { registerNewCourt,getMyCourtData,getSingleCourtData,getLatestUpdateDate,getAllCourtData,getslotData} = require('../controllers/userController');
const {payments,paymentsuccess} = require('../controllers/payment');
const vendorAuth = require('../middleware/vendorAuth');
var router = express.Router();


router.post('/register-court',vendorAuth,registerNewCourt)
router.get('/getMyCourtData',vendorAuth,getMyCourtData)
router.get('/getSingleCourtData',vendorAuth,getSingleCourtData)
router.get('/getLatestUpdateDate',vendorAuth,getLatestUpdateDate)
router.get('/getAllCourtData',vendorAuth,getAllCourtData)
router.get('/getslotData',getslotData)
router.post('/payments',payments)
router.post('/paymentsuccess',vendorAuth,paymentsuccess)   //// change  vendor auth to user auth







module.exports = router;


