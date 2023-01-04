const router = require('express').Router();
const UserService = require('./User.service');
const CourseService = require('../course/course.service');
const firebase = require('../helpers/firebase.service');

router.get('',getUser);
router.get('/courses',getCourses);
router.post('/logout', userLogout);


module.exports = router;


async function getUser(req,res,next)
{
    const uid = res.locals.user.uid;
    await UserService.getUser(uid)
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch(err=>{
        console.log(err);
        res.json(200).json({message:"Unable to retrieve user information"});
    })
}

async function getCourses(req,res,next)
{
    const uid = res.locals.user.uid;

    try{
        UserService.getCourses(uid)
        .then(async (response)=>{
          const products = response.map(item=>{return item.product_id});
         if(products.length > 0)
         {
          return await CourseService.getProductById(products)
         }

         return [];
        })
        .then(data=>{
          res.status(200).json({data:data});
        })
        .catch(err=>{
          console.log(err);
          res.status(400).json({message:"Failed to get item from courses"});
        })
     }
     catch(err)
     {
      console.log(err);
     }

}

async function userLogout(req,res,next){

  console.log("Logging Out");
  res.clearCookie('session');
  res.clearCookie('token');
  res.status(200).json({response:"Session Looged Out"});
}

