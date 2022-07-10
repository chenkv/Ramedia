import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const targetID = req.body.id;

    if (!targetID) {
      res.status(400);
      return;
    }

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

    res.status(400);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}