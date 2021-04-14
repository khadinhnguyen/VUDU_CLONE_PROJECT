
exports.adminAuthentication = (req,res,next)=>{
    if(req.session.userInfo)
    {
        if(req.session.userInfo.type=="admin"){
            next();
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
    
    
}; // must have semicolon

exports.loginAuthentication = (req,res,next) => {
    if(req.session.userInfo){
        next();
    }else{
        res.redirect('/');
    }
} 


