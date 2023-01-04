/**const { UpdatePaymentStatus } = require('../cart/cart.service');
const iosocket = require('./socket');
 
 const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 
 const stripeHandler = async (request, response)=>{
    let event = request.body;

    if ( process.env.stripe_endpointSecret) {
    
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          process.env.stripe_endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const payment_intent = event.data.object
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
      case 'checkout.session.completed':
        const sessionobj = event.data.object;  
           
           let cartobj = {};
           cartobj.payment_intent =  sessionobj.payment_intent;
           cartobj.customer_email = sessionobj.customer_details.email;
           cartobj.payment_status = sessionobj.payment_status.toUpperCase();

           console.log(sessionobj);
           setTimeout(async ()=>{
           await UpdatePaymentStatus(cartobj).then(()=>{
            iosocket.OnSuccess();
           })
           .catch(err=>{
            console.log(err);
           })
         }, process.env.PAYMENT_PROCESSING_TIME);
 
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    response.send();
  };

  module.exports = {
    stripeHandler
  }
  */