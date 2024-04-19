const { Pool } = require("pg");
require("dotenv").config();

const database = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = database;
