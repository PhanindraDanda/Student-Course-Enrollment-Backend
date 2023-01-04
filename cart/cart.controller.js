const router = require('express').Router();
const CartService = require('./cart.service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto-js');
const { ADD_TO_CART_SUCCESS, REMOVE_FROM_CART_SUCCESS, REMOVE_FROM_CART_FAILED, GET_CART_ITEMS_SUCCESS, GET_CART_ITEMS_FAILED } = require('../helpers/response.code');
const CourseService = require('../course/course.service');

router.post('/create-checkout-session',createCheckoutSession);
router.get('/getAll',getAll);
router.post('/add',addToCart);
router.post('/remove',RemoveFromCart);

module.exports = router;

async function createCheckoutSession(req,res,next)
{
   try{
    const useremail = res.locals.user.email; 
    const cartitems = req.body.courses.map(item=>{
     return {price:item.stripeId, quantity:1};
   });
 
    if(cartitems.length > 0)
    {  
       const session = await stripe.checkout.sessions.create({
         payment_method_types:['card'],
         line_items: cartitems,
         mode: 'payment',
         success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: process.env.STRIPE_FAIL_URL,
         customer_email:useremail
       });
 
       res.status(200).json({sessionId: session.id});
   }
    else{
      res.status(400).json({displayMessage:"Invalid Format"});
    }
    }
   catch(err)
   {
      res.status(400).json({status:err.raw.code,message:err.raw.message,displayMessage:"No Product Found"});
   }
}

async function addToCart(req,res,next)
{
   try{
   const cartobj = {};
   cartobj.user = res.locals.user.uid;
   cartobj.user_email = res.locals.user.email;
   cartobj.product = req.body.course.id;
   cartobj.cart_reference = crypto.SHA256(cartobj.user+""+cartobj.product).toString();
 
   CartService.InsertToCart(cartobj)
   .then(response=>{
     res.status(200).json({successCode:ADD_TO_CART_SUCCESS,message:"Item Added to Cart"});
   })
   .catch(err=>{
    console.log(err);
    if(err.errno == 1062)
    {
      res.status(400).json({successCode:ADD_TO_CART_SUCCESS,displayMessage:"Item is already added to Cart"});
    }
    
   })
   }
   catch(err)
   {
    console.log(err);
   }
}

async function RemoveFromCart(req,res,next)
{
   try{
      const cartobj = {};
      cartobj.user = res.locals.user.uid;
      cartobj.product = req.body.course.id;
  
      CartService.RemoveFromCart(cartobj)
      .then(response=>{
        res.status(200).json({successCode:REMOVE_FROM_CART_SUCCESS,message:"Item removed from Cart"});
      })
      .catch(err=>{
        console.log(err);
          res.status(400).json({successCode:REMOVE_FROM_CART_FAILED,displayMessage:"Failed to remove item from Cart"});
      })
   }
   catch(err)
   {
    console.log(err);
   }
}

async function getAll(req,res,next)
{
  const userid = res.locals.user.uid;
  try{
    CartService.getByUserID(userid)
    .then(async (response)=>{
      const products = response.map(item=>{return item.product_id});
     if(products.length > 0)
     {
      return await CourseService.getProductById(products)
     }
      return [];
    })
    .then(data=>{
      res.status(200).json({successCode:GET_CART_ITEMS_SUCCESS,data:data});
    })
    .catch(err=>{
      console.log(err);
        res.status(400).json({successCode:GET_CART_ITEMS_FAILED,displayMessage:"Failed to remove item from Cart"});
    })
 }
 catch(err)
 {
  console.log(err);
 }
}


