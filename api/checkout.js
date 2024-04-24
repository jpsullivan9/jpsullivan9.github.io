require("dotenv").config();
const apiKey = process.env.SECRET_KEY;
const stripe = require('stripe')(apiKey);
const apiURL  = 'https://api.stripe.com/v1';
const domain = 'https://swep-roject.vercel.app'
let isValidAddress= false;
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

const createProduct = async(name) =>{
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
        
      //  const product = await stripe.products.create({
       //     name : name,
       // });
        //res.status(200).send(product);
    }catch (err) {
        console.error('error creating product', err);
        throw err;
    }

};

const addPrice = async(productID, amount) =>{
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
        res.status(400).json({message : "failure adding price", details : err});
        throw err;
    }

};

const createPaymentLink = async(priceID) => {
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
        
        /*
        const session = await stripe.checkout.sessions.create({
        success_url : 'https://google.com',
            cancel_url = 
            line_items: [
                {
                price : priceID,
                quantity : 1,
                }
           ],
        mode : 'payment',    

        });

       */// console.log(session);
        //res.status(200).json({ses : session});
       return session;
    } catch (err) {
        res.status(400).json({message : "Failure to make payment link"});
        //console.error('error making payment link', err);
        throw err;

    }

};

module.exports = async (req, res) => {
    const {user_id} = req.body;

 

    try{
   const cartId = await pool.query('SELECT "cart_id" FROM carts WHERE "user_id" = $1', [user_id]);
    const cartItems = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId.rows[0].cart_id]);
   // res.status(200).json({cart_items : cartItems});
        let i;
        let subtotal = 0;
   for(i=0; i< cartItems.rowCount; i++){
        subtotal += cartItems.rows[i].price;
   }
          //  res.status(200).json({sub : subtotal});


   const username = await pool.query('SELECT username FROM accounts WHERE user_id = $1', [user_id]);
//res.status(200).json({apikey : process.env.SECRET_KEY});
   var product = await createProduct(username.rows[0].username);  
       
       /*await stripe.products.create({
        name : username,
   });*/
       //await createProduct(username.rows[0].username);     
     //  res.status(200).json({user : username.rows[0].username, prod : product, API : apiKey});
       // res.status(200).json({user : username.rows[0].username, price : subtotal*100});

   const price = await addPrice(product.id, Number(subtotal*100));
       // res.status(200).json({user : username.rows[0].username, price : price});
   const paymentLink = await createPaymentLink(price.id);
       res.status(200).json({payment : paymentLink.url});

    }catch (error) {
        res.status(500).json({message : "Failure getting payment", details : error});
    }

};
  /* (async () => {
  
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
*/
