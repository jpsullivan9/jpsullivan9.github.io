const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getSubCategories = async (req, res) => {
    try {
        const { id, catId } = req.query;
        if (id) {
            // Fetch a single sub-category.
            const { rows } = await pool.query("SELECT * FROM subcategories WHERE id = $1", [id]);

            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ error: "Subcategory not found" });
            }
        } else if (catId) {
            // Fetch subcategories for a given category id.
            const { rows }= await pool.query("SELECT * FROM subcategories WHERE category_id = $1", [catId]);
            res.status(200).json(rows);
        }
        else {
            const { rows }= await pool.query("SELECT * FROM subcategories ORDER BY id");
            res.status(200).json(rows);
        }
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Database query failed", details: error.message });
    }
};

module.exports = getSubCategories;