import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    let query = `SELECT favorites FROM user_movies WHERE id=${user.id};`;
    let result = await conn.query(query);

    if (result.rows[0].favorites) {
      for (let i = 0; i < result.rows[0].favorites.length; i++) {
        let element = result.rows[0].favorites[i];

        if (element == req.body.imdb_id) {
          res.status(400).json({ error: "Movie already added to favorites" });
          return;
        }
      }
    }

    query = `UPDATE user_movies SET favorites = array_append(favorites, '${req.body.imdb_id}') WHERE id=${user.id};`;
    result = await conn.query(query);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}