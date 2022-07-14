import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    if (!req.body.imdb_id || !user.id) {
      res.status(400);
      return;
    }

    let result = {bookmarked: false, watched: false};

    let query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
    let response = await conn.query(query);

    
    if (response.rows[0].bookmarks) {
      for (let i = 0; i < response.rows[0].bookmarks.length; i++) {
        let element = response.rows[0].bookmarks[i];

        if (element == req.body.imdb_id) {
          result.bookmarked = true;
        }
      }
    }

    query = `SELECT watched FROM user_movies WHERE id=${user.id};`;
    response = await conn.query(query);

    if (response.rows[0].watched) {
      for (let i = 0; i < response.rows[0].watched.length; i++) {
        let element = response.rows[0].watched[i];

        if (element.id == req.body.imdb_id) {
          result.watched = true;
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}