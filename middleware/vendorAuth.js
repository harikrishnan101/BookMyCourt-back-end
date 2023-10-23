const jwt=require('jsonwebtoken')
const vendorAuth=(req,res,next)=>{
   try {
    //  console.log(req.headers);
     const token=req.headers['authorization'].split(' ')
 jwt.verify(token[1],process.env.JWT_KEY,(err,decodedToken)=>{
         // console.log(decodedToken,'decodedToken'); 
         if(decodedToken){
             if(decodedToken?.role===2||decodedToken?.role===3){
                  req.userId=decodedToken.userId
                //   console.log(userId,'userid')
                  next()
             }else{
                 res.status(401).json({message:"unauthorized request"})
             }
 
         }else{
             res.status(401).json({message:"unauthorized request"})
         }
     })
   } catch (error) {
    res.status(403).json({message:" something went wrong  "})
   }    
    // console.log(verify,'verify');
   
}

module.exports=vendorAuth;

// const jwt=require('jsonwebtoken')
// const userAuth = (req, res, next) => {
//     console.log(req.headers);
  
//     // Extract the token from the 'Authorization' header
//     const token = req.headers['authorization'].split(' ');

//     console.log(token,"token");
  
//     // Verify the token using the JWT secret key (process.env.JWT_KEY)
//     const verify = jwt.verify(token[1], process.env.JWT_KEY, (err, user) => {
//       if (err) {
//         // If there's an error, it means the token is invalid
//         console.error('Token verification failed:', err);
//       } else {
//         // If verification is successful, 'user' contains the decoded token payload
//         console.log(user, 'decodedToken');
//       }
//     });
  
//     console.log(verify, 'verify');
//     next();
//   };
  
//   module.exports = userAuth;