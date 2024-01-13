const pg = require('pg');
require('dotenv').config({ path: '../../.env' });

const pool = new pg.Pool({
  host: `${process.env.host}`,
  port: process.env.port,
  database: `${process.env.database}`,
  user: `${process.env.user}`,
  password: `${process.env.password}`,
});

pool
  .query(
    `
  UPDATE posts
  SET loc = POINT(lng, lat)
  WHERE loc IS NULL;
`
  )
  .then(() => {
    console.log('Update complete');
    pool.end();
  })
  .catch((err) => console.error(err.message));
