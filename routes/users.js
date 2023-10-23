var express = require('express');
const { registerNewCourt,getMyCourtData,getSingleCourtData} = require('../controllers/userController');
const vendorAuth = require('../middleware/vendorAuth');
var router = express.Router();


router.post('/register-court',vendorAuth,registerNewCourt)
router.get('/getMyCourtData',vendorAuth,getMyCourtData)
router.get('/getSingleCourtData',vendorAuth,getSingleCourtData)





module.exports = router;


