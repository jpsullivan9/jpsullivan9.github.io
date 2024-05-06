const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const domain = 'https://swep-roject.vercel.app'

require("dotenv").config();

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


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
  console.log("add to cart");
  console.log(req.body);

  const header = req.headers["authorization"];
  let token;
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    token = bearer[1];
  } else {
    res.status(403).json({ message: "No token" });
  }
  const isValid = await tokenInfo(token);

  const user_id = isValid?.userID;
  const { productID, quantity } = await req.body;

  try {
  if (user_id !== undefined) {
    var cartId;
    //checks if cart is already created
    try {
      cartId = await pool.query("INSERT INTO carts (user_id) VALUES ($1)", [
        user_id,
      ]);
    } catch {}
    cartId = await pool.query(
      'SELECT "cart_id" FROM carts WHERE "user_id" = $1',
      [user_id]
    );

    //get product details
    const rowsProduct = await pool.query(
      "SELECT * FROM products where id = $1",
      [productID]
    );
    // res.status(400).json({quantity : rowsProduct.rows[0].stock_quantity});
    if (rowsProduct.rows[0].stock_quantity < 1) {
      //check if item is in stock
      res.status(404).json({ message: "Item is out of stock!" });
    }
    if (rowsProduct.rows[0].stock_quantity < quantity) {
      res
        .status(400)
        .json({ message: "Quantity is larger than available stock!" });
    }

    const price = rowsProduct.rows[0].price;
    const save = false;
    cartId = cartId.rows[0].cart_id;

    //check to see if item already in the cart_items
    const alreadyAdded = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productID]
    );

    if (quantity == 0) {
      // remove item from cart
      const remove = await pool.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productID]
      );
      res.status(200).json({ message: "Item successfully removed from cart!" });
    }

    //item already in cart
    if (alreadyAdded.rows.length > 0) {
      const update = await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productID]
      );
    } else {
      const result = await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, price, quantity, save_for_later) VALUES ($1, $2, $3, $4, $5)",
        [cartId, productID, price, quantity, save]
      );
    }

    res.status(200).json({ message: "Item successfully added to cart!" });
  } else {
    res.status(404).json({
      message:
        "User not found. Please create an account with us before adding to cart",
    });
  }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failure adding to cart", details: error.message });
  }
};
