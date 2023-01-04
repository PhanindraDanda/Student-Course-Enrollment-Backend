const auth =  require('../helpers/firebase.service');

const expiresIn = 60 * 60 * 24 * 5 * 1000;

const verifyuser = async function(req,res,next){
    try{
        const idToken = req.body.token;
    auth.verifyIdToken(idToken,true)
        .then(async (user)=>{
            return [await auth.createSessionCookie(idToken,{expiresIn}),user];
        })
        .then(result=>{
            const options = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite:'None'};
            res.cookie('session', result[0] ,options);
            res.cookie('token', result[1].uid,{maxAge:expiresIn,secure:true, sameSite:'None'});
            res.status(200).json({token:result[1]});
        })
        .catch(err=>{
            console.log(err);
            res.status(404).json({code:codes.FIREBASE_VERIFICATION_ERROR_CODE,message:"Unauthorized User"});
        })
    }
    catch(err)
    {
        res.status(404).json({code:codes.FIREBASE_VERIFICATION_ERROR_CODE,message:"Unauthorized User"});
    }
}

const verfiySession = async function(req,res,next)
{
    const sessionCookie = req.cookies.session || ''; 
    auth
    .verifySessionCookie(sessionCookie, true)
    .then((user) => {
        res.locals.user = user;
      next();
    })
    .catch((error) => {
      res.status(401).json({message:"UnAuthorized Request"});
    });
}

module.exports = {
    verifyuser,
    verfiySession
}