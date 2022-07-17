import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const showID = req.body.imdb_id;

    if (!showID || !user.id) {
      res.status(400);
      return;
    }

    let result = {tracked: false};

    let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND type='show' AND element_id='${showID}';`;
    let response = await conn.query(query);
    if (response.rowCount > 0) {
      result.tracked = true;
    }

    query = `SELECT * FROM mimir.watched_episode WHERE user_id=${user.id} AND show_id='${showID}'`
    response = await conn.query(query);
    result.watched = response.rows;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}