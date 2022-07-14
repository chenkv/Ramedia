import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    if (!req.body.imdb_id || !user.id) {
      res.status(400);
      return;
    }

    let result = {tracked: false};

    let query = `SELECT shows FROM user_shows WHERE id=${user.id};`;
    let response = await conn.query(query);

    console.log(response.rows[0].shows)

    if (response.rows[0].shows) {
      for (let i = 0; i < response.rows[0].shows.length; i++) {
        let element = response.rows[0].shows[i];

        if (element.imdb_id == req.body.imdb_id) {
          result.tracked = true;
          result.details = element;
        }
      }
    }

    // query = `SELECT watched FROM user_movies WHERE id=${user.id};`;
    // response = await conn.query(query);

    // if (response.rows[0].watched) {
    //   for (let i = 0; i < response.rows[0].watched.length; i++) {
    //     let element = response.rows[0].watched[i];

    //     if (element.id == req.body.imdb_id) {
    //       result.watched = true;
    //     }
    //   }
    // }

    // query = `SELECT favorites FROM user_movies WHERE id=${user.id};`;
    // response = await conn.query(query);

    // if (response.rows[0].favorites) {
    //   for (let i = 0; i < response.rows[0].favorites.length; i++) {
    //     let element = response.rows[0].favorites[i];

    //     if (element == req.body.imdb_id) {
    //       result.favorited = true;
    //     }
    //   }
    // }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}