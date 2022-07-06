import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const data = req.body.data;

    let query = `SELECT shows FROM user_shows WHERE id=${user.id};`;
    const response = await conn.query(query);

    if (response.rows[0].shows) {
      for (let i = 0; i < response.rows[0].shows.length; i++) {
        let element = response.rows[0].shows[i];

        if (element.imdb_id == data.imdb_id) {
          res.status(400).json({ error: "Show already added to watchlist" });
          return;
        }
      }
    }

    query = `UPDATE user_shows SET shows = (
                      CASE
                          WHEN shows IS NULL THEN '[]'::JSONB
                          ELSE shows
                      END
                  ) || '[${JSON.stringify(data)}]'::JSONB WHERE id = ${user.id};`
    const result = await conn.query(query);

    // var body = {
    //   user: user,
    //   imdb_id: req.body.imdb_id,
    //   date: req.body.date,
    //   movie: true
    // }

    // const options = {
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body)
    // };

    // var response = await fetch(`${base}/api/trakt/add-history`, options);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}