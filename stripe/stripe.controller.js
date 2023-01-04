const StripeService = require('./stripe.service');
const iosocket = require('../helpers/socket');
const CartService = require('../cart/cart.service');

const router = require('express').Router();

router.post('/update/payment',UpdatePayment);

module.exports = router;

async function UpdatePayment(req,res,next)
{
  const cartObj = req.body.cartObj;

  await CartService.UpdatePaymentStatus(cartObj).then(()=>{
      iosocket.OnSuccess();
      res.sendStatus(200);
  })
  .catch(err=>{
        console.log(err);
    })
}