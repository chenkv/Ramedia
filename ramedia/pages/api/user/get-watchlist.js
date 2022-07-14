import conn from "../../../lib/db";

const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
    const response = await conn.query(query);

    let movieres = [];

    if (response.rows[0].bookmarks) {
      for (let i = 0; i < response.rows[0].bookmarks.length; i++) {
        let element = response.rows[0].bookmarks[i];
  
        let curr = await fetch(`https://api.themoviedb.org/3/find/${element}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
        curr = await curr.json();
  
        movieres.push({
          id: element,
          details: curr.movie_results[0]
        });
      }
    }

    const query1 = `SELECT tracked FROM user_shows WHERE id=${user.id};`;
    const response1 = await conn.query(query1);

    let showres = [];

    if (response1.rows[0].tracked) {
      for (let i = 0; i < response1.rows[0].tracked.length; i++) {
        let element = response1.rows[0].tracked[i];
  
        let curr = await fetch(`https://api.themoviedb.org/3/find/${element}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
        curr = await curr.json();
  
        showres.push({
          id: element,
          details: curr.tv_results[0]
        });
      }
    }

    res.status(200).json({ movieres, showres });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}