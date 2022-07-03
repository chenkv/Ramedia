import conn from "../../../lib/db";

const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
    const response = await conn.query(query);

    let result = [];

    for (let i = 0; i < response.rows[0].bookmarks.length; i++) {
      let element = response.rows[0].bookmarks[i];

      let curr = await fetch(`https://api.themoviedb.org/3/find/${element}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
      curr = await curr.json();

      result.push({
        id: element,
        details: curr.movie_results[0]
      });
    }

    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}