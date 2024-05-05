require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// const domain = 'https://swep-roject.vercel.app'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function tokenInfo(token) {
  return jwt.verify(token, "superSecret", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return {
        userID: decoded.userId,
        username: decoded.username,
        isSeller: decoded.isSeller,
      };
    }
  });
}

module.exports = async (req, res) => {
  const header = req.headers["authorization"];
  let token;
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    token = bearer[1];

    var isValid = await tokenInfo(token);

    console.log(isValid);

  } else {
    res.status(403).json({ message: "No token" });
  }

  var user_id = isValid?.userID;
  if (user_id == undefined) {
    res.status(400).json({ message: "Not enough information" });
  }

  try {
    const cartId = await pool.query(
      'SELECT "cart_id" FROM carts WHERE "user_id" = $1',
      [user_id]
    );
    const cartItems = await pool.query(
      "SELECT * FROM cart_items as ci INNER JOIN products as p ON ci.product_id = p.id WHERE ci.cart_id = $1",
      [cartId.rows[0].cart_id]
    );
    let subtotal = 0;

    for (let i = 0; i < cartItems.rowCount; i++) {
      if (!cartItems.rows[i].save_for_later) {
        subtotal += cartItems.rows[i].price * cartItems.rows[i].quantity;
      }
    }

    res.status(200).json({
      products: cartItems.rows,
      subtotal: subtotal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart items", error: error });
  }
};
