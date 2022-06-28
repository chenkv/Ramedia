import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `UPDATE user_movies SET watched = array_append(watched, '${req.body.imdb_id}') WHERE id=${user.id};`;
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