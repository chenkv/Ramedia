import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `UPDATE user_movies SET watched = (
                      CASE
                          WHEN watched IS NULL THEN '[]'::JSONB
                          ELSE watched
                      END
                  ) || '[{"id": "${req.body.imdb_id}", "time": "${req.body.date}"}]'::JSONB WHERE id = ${user.id};`
    const result = await conn.query(query);

    var body = {
      user: user,
      imdb_id: req.body.imdb_id,
      date: req.body.date,
      movie: true
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    var response = await fetch(`${base}/api/trakt/add-history`, options);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}