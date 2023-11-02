var express = require('express');
const { registerNewCourt,getMyCourtData,getSingleCourtData,getLatestUpdateDate,getAllCourtData,getslotData} = require('../controllers/userController');
const vendorAuth = require('../middleware/vendorAuth');
var router = express.Router();


router.post('/register-court',vendorAuth,registerNewCourt)
router.get('/getMyCourtData',vendorAuth,getMyCourtData)
router.get('/getSingleCourtData',vendorAuth,getSingleCourtData)
router.get('/getLatestUpdateDate',vendorAuth,getLatestUpdateDate)
router.get('/getAllCourtData',vendorAuth,getAllCourtData)
router.get('/getslotData',getslotData)






module.exports = router;


