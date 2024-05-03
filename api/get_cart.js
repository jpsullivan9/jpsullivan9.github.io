require("dotenv").config();
const { Pool } = require("pg");

const domain = 'https://swe-project.vercel.app'

const domain = "http://localhost:3000";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const tokenInfo = async (token) => {
  try {
    const response = await fetch(`${domain}/api/userTokenInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });
    const data = await response.json();
    return data;
  } catch {
    return false;
  }
};

module.exports = async (req, res) => {
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

  const user_id = isValid.userID;

  if (user_id == undefined) {
    res.status(400).json({ message: "Not enough information" });
  }

  //   try {
  const cartId = await pool.query(
    'SELECT "cart_id" FROM carts WHERE "user_id" = $1',
    [user_id]
  );
  //res.status(200).json({cart : cartId});
  const cartItems = await pool.query(
    "SELECT * FROM cart_items as ci INNER JOIN products as p ON ci.product_id = p.id WHERE ci.cart_id = $1",
    [cartId.rows[0].cart_id]
  );
  // res.status(200).json({cart_items : cartItems});
  let subtotal = 0;

  for (let i = 0; i < cartItems.rowCount; i++) {
    if (!cartItems.rows[i].save_for_later) {
      subtotal += cartItems.rows[i].price * cartItems.rows[i].quantity;
    }
  }

  //  res.status(200).json({sub : subtotal});

  res.status(200).json({
    products: cartItems.rows,
    subtotal: subtotal,
  });
  //   } catch (error) {
  //     res.status(500).json({ message: "Failed to get cart items", error: error });
  //   }
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
