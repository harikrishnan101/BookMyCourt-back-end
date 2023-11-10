const jwt=require('jsonwebtoken')
const vendorAuth=(req,res,next)=>{
   try {
   
     const token=req.headers['authorization'].split(' ')
 jwt.verify(token[1],process.env.JWT_KEY,(err,decodedToken)=>{
         
         if(decodedToken){
             if(decodedToken?.role===2||decodedToken?.role===3){
                  req.userId=decodedToken.userId
               
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
   
   
}

module.exports=vendorAuth;

