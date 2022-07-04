import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    let query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
    const response = await conn.query(query);

    if (response.rows[0].bookmarks) {
      for (let i = 0; i < response.rows[0].bookmarks.length; i++) {
        let element = response.rows[0].bookmarks[i];

        if (element == req.body.imdb_id) {
          res.status(400).json({ error: "Movie already added to watchlist" });
          return;
        }
      }
    }

    query = `UPDATE user_movies SET bookmarks = array_append(bookmarks, '${req.body.imdb_id}') WHERE id=${user.id};`;
    const result = await conn.query(query);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}