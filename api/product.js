const database = require("./database");

const getProducts = async (req, res) => {
    try {
        const { pid, featured, scid } = req.query;
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
            const { rows } = await database.query("SELECT * FROM products WHERE $1 = ANY (subcategories)", [scid]);

            res.status(200).json(rows);
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
};

module.exports = getProducts;