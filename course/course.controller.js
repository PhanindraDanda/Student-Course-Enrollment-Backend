const router = require('express').Router();
const CourseService = require('./course.service');

router.get('/getAll',getAll);
router.get('/my-courses/:id',getById)


module.exports = router;

async function getAll(req,res,next)
{

await CourseService.getAll()
   .then(async (products)=>{
    res.status(200).json(products);
   })
   .catch(err=>{
    console.log(err);
   })
   
}

async function getById(req,res,next)
{

}
