import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const movieID = req.body.imdb_id;

    if (!movieID || !user.id) {
      res.status(400);
      return;
    }

    let result = {bookmarked: false, watched: false};

    let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND element_id='${movieID}';`;
    let response = await conn.query(query);
    if (response.rowCount > 0) {
      result.bookmarked = true;
    }

    query = `SELECT * FROM mimir.watched_movie WHERE user_id=${user.id} AND movie_id='${movieID}';`;
    response = await conn.query(query);
    if (response.rowCount > 0) {
      result.watched = true;
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}