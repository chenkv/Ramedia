import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const targetID = req.body.id;

    if (!targetID) {
      res.status(400).end();
      return;
    }

    if (req.body.movie) {
      let query = `SELECT bookmarks FROM user_movies WHERE id=${user.id};`;
      let result = await conn.query(query);

      if (result.rows[0].bookmarks) {
        for (let i = 0; i < result.rows[0].bookmarks.length; i++) {
          let element = result.rows[0].bookmarks[i];

          if (element == targetID) {
            let deleteQuery = `UPDATE user_movies SET bookmarks = array_remove(bookmarks, '${targetID}') WHERE id=${user.id};`;
            await conn.query(deleteQuery);
          }
        }
      }
    }

    if (req.body.show) {
      let query = `SELECT tracked FROM user_shows WHERE id=${user.id};`;
      let result = await conn.query(query);

      if (result.rows[0].tracked) {
        for (let i = 0; i < result.rows[0].tracked.length; i++) {
          let element = result.rows[0].tracked[i];

          if (element == targetID) {
            let deleteQuery = `UPDATE user_shows SET tracked = array_remove(tracked, '${targetID}') WHERE id=${user.id};`;
            await conn.query(deleteQuery);
          }
        }
      }
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}