const database = require("./database");

const featured_products = async (req, res) => {
    try {
        // Fetch only featured products
        const { rows } = await database.query("SELECT p.id, p.name, p.description, p.price, p.image_url, p.featured, s.id AS scid, s.category_id AS cid FROM products AS p LEFT JOIN subcategories AS s ON s.id = p.subcategory WHERE featured = true");

        res.status(200).json(rows);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Database query failed", details: error.message });
    }
};

module.exports = featured_products;