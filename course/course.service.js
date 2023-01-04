const db = require('../helpers/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    getAll,
    getProductById,
    getbyPaymentID,
};


async function getAll()
{
   return new Promise(async (resolve,reject)=>{
    try{
        const products = await stripe.products.list({
            active:true,
            limit:30,
            expand:['data.default_price']
          })

         resolve(formatResponse(products));  
    }
    catch(err){
        reject(err);
    }      

   }) 
}

async function getProductById(productid)
{
    return new Promise(async (resolve,reject)=>{
        try{
            const products = await stripe.products.list({
                active:true,
                limit:30,
                ids:productid,
                expand:['data.default_price']
            })

           resolve(formatResponse(products));  
        }
        catch(err){
            reject(err);
        }      
    
       }) 
}

function getbyPaymentID(payment_reference)
{
    return new Promise(async (resolve,reject)=>{
        try{
            const products = await await stripe.checkout.sessions.list({
                payment_intent:payment_reference,
                limit: 3,
              });
            resolve(products);
        }
        catch(err){
            reject(err);
        }      
    
       }) 
}

function formatResponse(products)
{
    const product_arr = products.data.map(product=>{
        let item = {};
        item.id = product.id;
        item.courseTitle = product.name;
        item.description = product.description;
        item.imageUrl = product.images[0];
        item.stripeId = product.default_price.id;
        item.currency = product.default_price.currency.toUpperCase();
        item.cost = ((product.default_price.unit_amount)/100).toFixed(2);
        return item;
        });
    return product_arr;
}


