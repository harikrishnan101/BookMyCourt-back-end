var express = require('express');
const {addCourtTimings} = require('../controllers/userController');
const vendorAuth = require('../middleware/vendorAuth');
var router = express.Router();



router.post('/addCourtTimings',vendorAuth,addCourtTimings)







module.exports = router;


