const database = require("./database");

const getCategories = async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            // Fetch a single product by ID
            const { rows } = await database.query("SELECT * FROM categories WHERE id = $1", [id]);

            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ error: "Category not found" });
            }
        } else {
            // Fetch only featured products
            const { rows } = await database.query("SELECT * FROM categories ORDER BY name");

            res.status(200).json(rows);
        }
    } catch (error) {
        console.error("Database query error: ", error);
        res.status(500).json({ error: "Database query failed", details: error.message });
    }
};

module.exports = getCategories;
