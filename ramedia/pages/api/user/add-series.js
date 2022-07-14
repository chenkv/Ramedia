import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const data = req.body.data;

    let query = `SELECT tracked FROM user_shows WHERE id=${user.id};`;
    const response = await conn.query(query);

    if (response.rows[0].tracked) {
      for (let i = 0; i < response.rows[0].tracked.length; i++) {
        let element = response.rows[0].tracked[i];

        if (element == data.imdb_id) {
          res.status(400).json({ error: "Show already added to watchlist" });
          return;
        }
      }
    }

    query = `SELECT shows FROM user_shows WHERE id=${user.id};`;
    let result = await conn.query(query);

    let addedToShows = false;
    if (result.rows[0].shows) {
      for (let i = 0; i < result.rows[0].shows.length; i++) {
        let element = result.rows[0].shows[i];

        if (element.imdb_id == data.imdb_id) {
          addedToShows = true;
        }
      }
    }

    if (!addedToShows) {
      query = `UPDATE user_shows SET shows = (
                        CASE
                            WHEN shows IS NULL THEN '[]'::JSONB
                            ELSE shows
                        END
                    ) || '[${JSON.stringify(data)}]'::JSONB WHERE id = ${user.id};`
      result = await conn.query(query);
    }

    query = `UPDATE user_shows SET tracked = array_append(tracked, '${data.imdb_id}') WHERE id=${user.id};`;
    result = await conn.query(query);

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}