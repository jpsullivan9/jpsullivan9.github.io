const {Pool} = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  module.exports = async (req, res) => {
    const {email, productID, quantity} = await req.body;
    //get user_id from email post request and check if valid user 
    if(email == undefined || productID == undefined){
        res.status(400).json({message : "Not enough information"});
       }

    try{

    let {rows} = await pool.query('SELECT user_id FROM accounts WHERE email = $1', [email]);
   //res.status(400).json({userId : rows[0].user_id});
    if(rows[0] !== undefined){
        //get user_id
        const userID = rows[0].user_id;
        var cartId;
        //res.status(400).json({cart: cartId, userID : userID});
      //checks if cart is already created 
            try{
                cartId = await pool.query('INSERT INTO carts (user_id) VALUES ($1)', [rows[0].user_id]);
            }catch{}
                 cartId = await pool.query('SELECT "cart_id" FROM carts WHERE "user_id" = $1', [rows[0].user_id]);
                //deal with time created and updated later 
               
        //get product details
        const rowsProduct = await pool.query('SELECT * FROM products where id = $1', [productID]);
       // res.status(400).json({quantity : rowsProduct.rows[0].stock_quantity});
        if(rowsProduct.rows[0].stock_quantity== 0){
            //check if item is in stock
            res.status(404).json({message : "Product is sold out!"});
        }
        if(rowsProduct.rows[0].stock_quantity < quantity){
            res.status(400).json({message : "Quantity is larger than available stock!"});

        }
       // res.status(400).json

      //  const item_quantity  = await pool.query('SELECT quantity FROM cart_items WHERE (user_id, product_id) = $1, $2', [rows[0].user_id, productID]); 
        const price  = rowsProduct.rows[0].price;
        const save = false;
        cartID = cartId.rows[0].cart_id;

        //check to see if item already in the cart_items 
        const alreadyAdded = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartID, productID]);
       // res.status(400).json({added : alreadyAdded});
        
           //item already in cart
           if(alreadyAdded.rows.length > 0){
            const update  = await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3', [quantity + alreadyAdded.rows[0].quantity, cartID, productID]);
           }
            else{
            const result = await pool.query("INSERT INTO cart_items (cart_id, product_id, price, quantity, save_for_later) VALUES ($1, $2, $3, $4, $5)", [cartID, productID, price, quantity, save]);
            }
           // res.status(400).json({cart_id : cartId, price : price, quantity : 1, save : save, product: productID});
        //add item into cart items
       
        res.status(200).json({message : "Item successfully added to cart!"});
    }else{
        res.status(404).json({message : "User not found. Please create an account with us before adding to cart"});

    }
}catch (error){

    res.status(500).json({message : "Failure adding to cart", details : error.message});
}
    //once retrived get the cart_id
    //once cart_id retrieved add to cart_items



  };
