import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const movieID = req.body.imdb_id;
    const date = req.body.date;

    let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND element_id='${movieID}';`;
    let response = await conn.query(query);
    if (response.rowCount > 0) {
      var body = {
        user: user,
        id: movieID,
      }
  
      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };
      await fetch(`${base}/api/user/delete-watchlist`, options);
    }

    query = `INSERT INTO mimir.watched_movie(user_id, movie_id, date) VALUES('${user.id}', '${movieID}', '${date}');`;
    response = await conn.query(query);

    var body = {
      user: user,
      imdb_id: req.body.imdb_id,
      date: date,
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