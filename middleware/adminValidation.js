const adminLogin = (req,res,next)=>{
    if(req.session.userInfo.type == "admin"){
        next()
    }
    next();
};