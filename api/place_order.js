
const { Pool } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const apiKey = process.env.SECRET_KEY;
const stripe = require('stripe')(apiKey);
const EasyPost = require('@easypost/api');
const client = new EasyPost(process.env.EasyPost_SECRET_KEY2);
const domain  = 'https://rutgers-swe-project.vercel.app/';
const apiURL  = 'https://api.stripe.com/' ;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

 module.exports = async (req, res) => {
  const {checkout_id, user_id, coupon, street1, city, state, zip, country, productID, subtotal} = await req.body;
//(async () => {
   //const res = await fetch('https://swep-roject.vercel.app/pages/checkout.html');
  try{ 

    const session = await stripe.checkout.sessions.retrieve(checkout_id);

    if(session.payment_status != 'paid'){
      res.status(403).json({message : "payment not completed!"});
    }

    if(coupon !== undefined){
            const discounted  = await pool.query('UPDATE coupons SET active = $1 WHERE userid = $2 AND code = $3', [false, user_id, coupon]);

    }
    
    
  let shipment;
    
     shipment = await client.Shipment.create({
    to_address: {
      name: ' ',
      street1: street1,
      city: city,
      state: state,
      zip: zip,
      country: country,
      email: ' ',
      phone: ' ',
    },
      from_address: {
      street1: '417 montgomery street',
      street2: 'FL 5',
      city: 'San Francisco',
      state: 'CA',
      zip: '94104',
      country: 'US',
      company: 'EasyPost',
      phone: '415-123-4567',
    },
    parcel: {
      length: 20.2,
      width: 10.9,
      height: 5,
      weight: 65.9,
    },
  });
    
  const tracker = await client.Tracker.create({
    tracking_code: 'EZ1000000001',
    carrier: 'USPS',
    shipment_id : shipment.id,
  });
    //res.status(200).json({tracking : tracker});
   
   // const email = 'sull@gmail.com';
    /*
   if(email == undefined || shippingAddress == undefined || productID == undefined){
    res.status(400).json({message : "Not enough information"});
   }
   */
    
    //const {rows} = await pool.query('SELECT user_id FROM accounts WHERE email = $1', [email]);
  if(user_id != undefined){
    const status = tracker.status; 
    //const productID = '1234';
    //const shippingAddress = "123 Street"
   // const {orders} = await pool.query(`SELECT user_id FROM orders WHERE order_id = $1`, [productID]);
    //console.log(orders);
/*
    if(orders != undefined){
      //console.log('cannot add order');
      res.status(400).json({error : "Order has already been placed"});
    }
    */
    //{

     const cartId = await pool.query('SELECT "cart_id" FROM carts WHERE "user_id" = $1', [user_id]);
    const deleteItems = await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId.rows[0].cart_id]);
   // const cartItems = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId.rows[0].cart_id]);
    
                      let shippingAddress = street1 + ' ' + city + ' ' + state + ', ' + zip + ', ' + country;

    const result = await pool.query('INSERT INTO orders (user_id, shipping_address, status, total_price, tracker, trackerID) VALUES ($1, $2, $3, $4, $5, $6)', [user_id, shippingAddress, status, subtotal, tracker.public_url, tracker.id]);
      
   res.status(201).json({message : "Order successfully created", totalPrice : subtotal, status : status, orderID : shipment.id});
  /*}
  } else{
    res.status(404).json({message : 'Email Not Found'});
  }
 */
  }
}catch (error){
 // console.error("Failure placing order", error);
  
  res.status(500).json({messaage : "Failure placing order", details : error.message});
}
 };

//})();

//}
/*
const {name, emailAddress} = req.body;
const makePayment = async () =>{
  const body = item; //sample item
  const header = {'Content-type'  : 'application/json'};
  const response  = await fetch(`{apiURL}/create-checkout-session`, {

    method : "POST",
    header : header,
    body : JSON.stringify(body)
  })

  const session = await response.json();

}
*/
