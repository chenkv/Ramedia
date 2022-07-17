import conn from "../../../../lib/db";

const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    let query = `SELECT * FROM mimir.bookmark WHERE type='movie' AND user_id=${user.id};`;
    let bookmarks = await conn.query(query)

    let movieres = [];

    if (bookmarks.rowCount > 0) {
      for (let i = 0; i < bookmarks.rows.length; i++) {
        let element = bookmarks.rows[i];
  
        let curr = await fetch(`https://api.themoviedb.org/3/find/${element.element_id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
        curr = await curr.json();
  
        movieres.push({
          id: element,
          details: curr.movie_results[0]
        });
      }
    }

    query = `SELECT * FROM mimir.bookmark WHERE type='show' AND user_id=${user.id};`;
    bookmarks = await conn.query(query);

    let showres = [];

    if (bookmarks.rowCount > 0) {
      for (let i = 0; i < bookmarks.rows.length; i++) {
        let element = bookmarks.rows[i];
  
        let curr = await fetch(`https://api.themoviedb.org/3/find/${element.element_id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
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