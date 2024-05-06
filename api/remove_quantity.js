const {Pool} = require("pg");
require("dotenv").config();
const domain  = 'https://rutgers-swe-project.vercel.app';

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
    const {productID} = await req.body;

    try {
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

        user_id = isValid.userID;

        if(user_id == undefined){
          res.status(400).json({verified : false, message : "failure"});

        }
          const cartId = await pool.query('SELECT "cart_id" FROM carts WHERE "user_id" = $1', [user_id]);
        const product = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId.rows[0].cart_id, productID]);
                    //res.status(200).json({message : "Quantity of item decreased by 1!", cart_item : product.rows[0].quantity});

        //const product= await pool.query('SELECT * FROM cart_items WHERE cart_item_id = $1', [cart_items.rows[0].cart_item_id]); 
        const quantity = product.rows[0].quantity; 
        const updatedQuant = Number(quantity) - 1;
        const result  = await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3', [updatedQuant, cartId.rows[0].cart_id, productID]);
            if(quantity == 1){
                const deleted = await pool.query('DELETE FROM cart_items WHERE cart_item_id = $1', [cart_item_id]);
            }
                res.status(200).json({message : "Quantity of item decreased by 1!", quant : quantity});
    }catch(error){
        res.status(500).json({message : "Failure removing item", details: error});
    }


  };
