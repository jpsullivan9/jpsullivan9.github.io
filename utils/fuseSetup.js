const { Pool } = require('pg');
const Fuse = require('fuse.js');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function getProductNames() {
  const result = await pool.query('SELECT name FROM products');
  return result.rows.map(row => ({ name: row.name }));
}

let fuse;

async function setupFuse() {
  const names = await getProductNames();
  const options = {
    keys: ['name'],
    includeScore: true,
    threshold: 0.2,
  };
  fuse = new Fuse(names, options);
}

async function getSuggestions(query, productNames) {
  if (!fuse) await setupFuse(productNames);
  return fuse.search(query).map(result => result.item.name);
}

setupFuse().then(() => {
    console.log('Fuse has been set up with product names.');
  });

module.exports = { getSuggestions };