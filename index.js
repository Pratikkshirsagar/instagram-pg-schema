const express = require('express');
const pg = require('pg');

require('dotenv').config();

const pool = new pg.Pool({
  host: `${process.env.host}`,
  port: process.env.port,
  database: `${process.env.database}`,
  user: `${process.env.user}`,
  password: `${process.env.password}`,
});

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/posts', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM posts;
  `);

  res.send(`
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>lng</th>
          <th>lat</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((row) => {
            return `
            <tr>
              <td>${row.id}</td>
              <td>${row.lng}</td>
              <td>${row.lat}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
    <form method="POST">
      <h3>Create Post</h3>
      <div>
        <label>Lng</label>
        <input name="lng" />
      </div>
      <div>
        <label>Lat</label>
        <input name="lat" />
      </div>
      <button type="submit">Create</button>
    </form>
  `);
});

app.post('/posts', async (req, res) => {
  const { lng, lat } = req.body;

  await pool.query('INSERT INTO posts (lat, lng) VALUES ($1, $2);', [lat, lng]);

  res.redirect('/posts');
});

app.listen(3005, () => {
  console.log('Listening on port 3005');
});