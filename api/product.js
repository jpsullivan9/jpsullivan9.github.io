const database = require("./database");

const retrieveProduct = async (pid, featured, scid, res) => {
    try {
        if (pid) {
            // Fetch a single product by ID
            const { rows } = await database.query("SELECT * FROM products WHERE id = $1", [pid]);

            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        } else if (featured) {
            // Fetch only featured products
            const { rows } = await database.query("SELECT * FROM products WHERE featured = true");

            res.status(200).json(rows);
        } else if (scid) {
            // Fetch products with the passed in subcategory
            const { rows } = await database.query("SELECT * FROM products WHERE $1 = subcategory", [scid]);

            res.status(200).json(rows);
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
};

const getProducts = async (req, res) => {
    if (req.method === "GET") {
        const { pid, featured, scid } = req.query;
        retrieveProduct(pid, featured, scid, res);
    };
    if (req.method === "POST") {
        saveProduct(req.body, res);
    }
};

const saveProduct = async (json, res) => {
    try {
        const image_url = json.image1 + "," + json.image2 + "," + json.image3;
        const stock = json.stock < 0 ? 5 : (json.stock > 100 ? 100 : json.stock);
        const rating = json.ratingAverage < 0 ? 1 : (json.ratingAverage > 5 ? 5 : json.ratingAverage);
        // Check if price > 0
        if (json.price <=0) {
            return res.status(400).json({ error: 'Price must be greater than 0!' });
        }

        const result = await database.query(
            'INSERT INTO products(name, description, image_url, stock_quantity, price, average_review_score, seller_id, subcategory, featured) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [json.productName, json.productDescription, image_url, stock, json.price,
            rating, json.username, json.subcategories, json.featured]
        );
        return res.status(201).json({ message: `Product ${json.productName} with ${result.rows[0].id} created successfully!` });
    } catch(error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed saving product!', details: error.message });
    }
};

module.exports = getProducts;