import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    let query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
    let result = await conn.query(query);

    if (result.rows[0].bookmarks) {
      for (let i = 0; i < result.rows[0].bookmarks.length; i++) {
        let element = result.rows[0].bookmarks[i];

        if (element == req.body.imdb_id) {
          var body = {
            user: user,
            id: req.body.imdb_id,
          }
      
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          };
      
          fetch(`${base}/api/user/delete-watchlist`, options);
        }
      }
    }

    query = `UPDATE user_movies SET watched = (
                      CASE
                          WHEN watched IS NULL THEN '[]'::JSONB
                          ELSE watched
                      END
                  ) || '[{"id": "${req.body.imdb_id}", "time": "${req.body.date}"}]'::JSONB WHERE id = ${user.id};`
    result = await conn.query(query);

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

    await fetch(`${base}/api/trakt/add-history`, options);

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}