var express = require('express');
const {dosignup,dologin}=require('../controllers/auth')

var router = express.Router();

router.post('/register',dosignup)
router.post('/login',dologin)


module.exports=router;