const { Pool } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const apiKey = process.env.SECRET_KEY;
const stripe = require("stripe")(apiKey);
const domain = "https://rutgers-swe-project.vercel.app/";
const apiURL = "https://api.stripe.com/";
const jwt = require("jsonwebtoken");


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function tokenInfo(token){
  return jwt.verify(token, 'superSecret', (err, decoded) => {
      if (err) {
          return false;
      } else {
          return {userID: decoded.userId, username: decoded.username, isSeller: decoded.isSeller};
      }
  });
}

module.exports = async (req, res) => {
  const { productID } = req.body;

  //   try {
  const header = req.headers["authorization"];
  let token;
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    token = bearer[1];
    //const isValid = await tokenInfo(token);

    // res.status(200).json({token : token, valid : isValid});
    // req.token = token;
  } else {
    res.status(403).json({ message: "No token" });
  }
  const isValid = await tokenInfo(token);

  const user_id = isValid?.userID;

  const cartId = await pool.query(
    'SELECT "cart_id" FROM carts WHERE "user_id" = $1',
    [user_id]
  );
  //operation can only be performed on cart items, no input validation

  // cart_item = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId.rows[0].cart_id, productID]);
  // res.status(200).json({message : "item successfully added to save for later!", cartId : cartId.rows[0].cart_id, cartId_array : cartId});

  const update = await pool.query(
    "UPDATE cart_items SET save_for_later = $1 WHERE cart_id = $2 AND product_id = $3",
    [true, cartId.rows[0].cart_id, productID]
  );
  res
    .status(200)
    .json({ message: "item successfully added to save for later!" });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Failure adding to save for later", details: error });
  //   }
};
