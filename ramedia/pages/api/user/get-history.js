import conn from "../../../lib/db";
const base = process.env.BASE_URL;
const tmdbKey = process.env.TMDB_KEY

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `SELECT watched FROM user_movies WHERE id=${user.id};`;
    const result = await conn.query(query);

    let response = [];

    if (result.rows[0].watched) {
      for (let i = 0; i < result.rows[0].watched.length; i++) {
        let element = result.rows[0].watched[i].id;
  
        let curr = await fetch(`https://api.themoviedb.org/3/find/${element}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`, { method: 'GET' });
        curr = await curr.json();
  
        response.push({
          id: element,
          details: curr.movie_results[0]
        });
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}