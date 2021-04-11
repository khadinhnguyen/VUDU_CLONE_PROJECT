exports.adminLogin = (req,res,next)=>{
    if(req.session.userInfo.type == "admin"){
        next()
    }
    next();
}; // must have semicolon

exports.isLoggedIn = (req,res,next)=>{
    if(req.session.userInfo){
        next()
    }
    else{
        res.redirect("/user/login");
    }
};

exports.middleware1=(req,res,next)=>{

    req.justiceleague = "Kha";

    next();
}; 

exports.middleware2=(req,res,go)=>{

    console.log(req.justiceleague);
    go();
};

