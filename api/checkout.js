require("dotenv").config();
const apiKey = process.env.SECRET_KEY;
const stripe = require('stripe')(apiKey);
const apiURL  = 'https://api.stripe.com/v1';
let isValidAddress= false;
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

async function createProduct(name){
    try {
        const response = await fetch(`${apiURL}/products`, {
            method : 'POST',
            headers: {

                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body : `name=${name}&type=service`
        });
        const product = await response.json();
        return product;
    }catch (err) {
        console.error('error creating product', err);
        throw err;
    }

};

async function addPrice(productID, amount){
    try{
        const response = await fetch(`${apiURL}/prices`, {
            method : "POST",
            headers : {
                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body : `unit_amount=${amount}&product=${productID}&currency=usd`,

        });
       // console.log(response);

        const price = await response.json();
        return price;
    }catch (err) {
        console.error('error adding price', err);
        throw err;
    }

};

async function createPaymentLink(priceID){
    try{
        const response = await fetch(`${apiURL}/checkout/sessions`, {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : `mode=payment&payment_method_types[0]=card&success_url=https://google.com&cancel_url=${domain}/pages/checkout.html&line_items[0][price]=${priceID}&line_items[0][quantity]=1`
        });
        //console.log(response);
        const session = await response.json();
       // console.log(session);
        return session.url;
    } catch (err) {
        console.error('error making payment link', err);
        throw err;

    }

};

   (async () => {
  
    try {

        let name  = "Coffee Mug";
        const {rows} = await pool.query('SELECT price FROM products WHERE name = $1', [name]);

            const objValues = Object.values(rows[0]);
            console.log(rows[0]);
            console.log(objValues[0]);
            

        var product = await createProduct(name);
       //console.log(product);
     const price = await addPrice(product.id, objValues[0]*100);
       //console.log(price);
        const paymentLink = await createPaymentLink(price.id);
        if(paymentLink != undefined){
        //res.status(200).json({payment : paymentLink, messgae : 'continue to payment'});
       console.log(`Payment Link : ${paymentLink}`);
        }else{
            //res.status(400).json({message: "failure to create payment link"});
           console.log('failure to make payment link');
        }
        //console.log(paymentLink);
    }catch (err) {
        console.error('error' , err);
    }

})();
