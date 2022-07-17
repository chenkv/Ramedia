import conn from "../../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const element_id = req.body.imdb_id;

    if (req.body.movie) {
      let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND type='movie' AND element_id='${element_id}';`;
      let response = await conn.query(query);
      if (response.rowCount > 0) {
        res.status(400).json({ error: "Movie already added to watchlist" });
        return;
      }
  
      query = `SELECT * FROM mimir.watched_movie WHERE user_id=${user.id} AND movie_id='${element_id}';`;
      response = await conn.query(query);
      if (response.rowCount > 0) {
        res.status(400).json({ error: "Movie already seen" });
        return;
      }
  
      query = `INSERT INTO mimir.bookmark(user_id, type, element_id) VALUES('${user.id}', 'movie', '${element_id}');`;
      await conn.query(query);
    }
    
    if (req.body.show) {
      let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND type='show' AND element_id='${element_id}';`;
      let response = await conn.query(query);
      if (response.rowCount > 0) {
        res.status(400).json({ error: "Show already added to watchlist" });
        return;
      }
  
      // query = `SELECT * FROM mimir.watched_movie WHERE user_id=${user.id} AND movie_id='${element_id}';`;
      // response = await conn.query(query);
      // if (response.rowCount > 0) {
      //   res.status(400).json({ error: "Movie already seen" });
      //   return;
      // }
  
      query = `INSERT INTO mimir.bookmark(user_id, type, element_id) VALUES('${user.id}', 'show', '${element_id}');`;
      await conn.query(query);
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}