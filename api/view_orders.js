const { Pool } = require("pg");
require("dotenv").config();
const domain = 'https://swep-roject.vercel.app'
const apiURL  = 'https://api.stripe.com/' ;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const tokenInfo = async (token) =>{
   try{
      const response = await fetch(`${domain}/api/userTokenInfo`, {
         method : 'POST',
         headers : {
            'Content-Type' : 'application/json',
      },
        body :  JSON.stringify({token : token}),                          
      });
      const data = await response.json();
   return data;
      
   }catch{
      return false;
   }

}

module.exports = async(req, res) => {
//change later 
           try{
             
        const header = req.headers['authorization'];
       let token;
      if(typeof header !== 'undefined'){
        const bearer = header.split(' ');
        token = bearer[1];
      //const isValid = await tokenInfo(token);

         // res.status(200).json({token : token, valid : isValid});
         // req.token = token;
      } else{
            res.status(403).json({message : "No token"});
      }
      const isValid = await tokenInfo(token);
 
    let user_id = isValid.userID;

 // res.status(200).json({user : user_id});
  

    //    const valid  = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [user_id]);

     //   if(valid.rowCount >0){
    orders = await pool.query('SELECT * FROM orders WHERE "user_id" = $1', [user_id]);
    //operation can only be performed on cart items, no input validation     

 // cart_item = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId.rows[0].cart_id, productID]);
     // res.status(200).json({message : "item successfully added to save for later!", cartId : cartId.rows[0].cart_id, cartId_array : cartId});

        res.status(200).json({message : "Viewing Cart:", order : orders.rows});
       // }else{
       //   res.status(400).json({message : "account not found!"});
      //  }
    }catch(error) {
        res.status(500).json({message : "can't fetch order items"});
    }
   

}
