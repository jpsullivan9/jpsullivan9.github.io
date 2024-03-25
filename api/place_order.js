
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

 module.exports = async (req, res) => {
  const {email, shippingAddress, productID} = await req.query;
//(async () => {
   //const res = await fetch('https://swep-roject.vercel.app/pages/checkout.html');
  try{ 
   
   // const email = 'sull@gmail.com';
   if(email == undefined || shippingAddress == undefined || productID == undefined){
    res.status(400).json({message : "Not enough information"});
   }
    const {rows} = await pool.query('SELECT user_id FROM accounts WHERE email = $1', [email]);
  if(rows.length > 0 ){
    const status = "confirmed"; 
    //const productID = '1234';
    //const shippingAddress = "123 Street"
    const {orders} = await pool.query(`SELECT user_id FROM orders WHERE order_id = $1`, [productID]);
    //console.log(orders);

    if(orders != undefined){
      //console.log('cannot add order');
      res.status(400).json({error : "Order has already been placed"});
    }
    else{
    const result = await pool.query('INSERT INTO orders (user_id,  order_id, shipping_address, status) VALUES ($1, $2, $3, $4)', [rows[0].user_id, productID, shippingAddress, status]);
      
   res.status(200).json({message : "Order successfully created"});
  }
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
