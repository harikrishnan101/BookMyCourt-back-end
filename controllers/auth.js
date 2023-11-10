const USER = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10

const dosignup = (req, res) => {
    try {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
               
                // Now we can store the password hash in db.
                USER({firstname: req.body.firstname,lastname: req.body.lastname,email:req.body.email,password:hash}).save().then((response => {
                    res.status(200).json({ signup: true })
                }))
            });
        });
    } catch (error) {
        res.status(502).json({ signup: false, message: error }) 
    }

}

const dologin = async (req, res) => {
    try {
        const user = await USER.findOne({ email:req.body.email })
      
    
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, response) {
                
    
                if (response) {
                    const token = jwt.sign({ userId: user._id,email:user.email,firstname:user.firstname,lastname:user.lastname,role:user.role},process.env.JWT_KEY, {
                        expiresIn: '2d'
                        
                    })
                    // user.password=undefined
                    
                    res.status(200).json({login:true, token:token,user:user})
                }
                else{
                    res.status(403).json({ login: false})
                     
                }
            });
        }
    } catch (error) {
        res.status(403).json({ login: false})
    
    }
   

}

module.exports = {dosignup,dologin}