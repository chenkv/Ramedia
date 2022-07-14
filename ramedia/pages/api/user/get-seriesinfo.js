import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    if (!req.body.imdb_id || !user.id) {
      res.status(400);
      return;
    }

    let result = {tracked: false};

    let query = `SELECT tracked FROM user_shows WHERE id=${user.id};`;
    let response = await conn.query(query);

    if (response.rows[0].tracked) {
      for (let i = 0; i < response.rows[0].tracked.length; i++) {
        let element = response.rows[0].tracked[i];

        if (element == req.body.imdb_id) {
          result.tracked = true;
        }
      }
    }

    if (result.tracked) {
      query = `SELECT shows from user_shows WHERE id=${user.id};`;
      response = await conn.query(query);

      if (response.rows[0].shows) {
        for (let i = 0; i < response.rows[0].shows.length; i++) {
          let element = response.rows[0].shows[i];

          if (element.imdb_id == req.body.imdb_id) {
            result.details = element;
          }
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}