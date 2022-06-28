import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    var data = req.body;

    let userID;

    let query_find = `SELECT * FROM users WHERE email = '${data.email}';`;
    let result_find = await conn.query(query_find);

    if (result_find.rowCount > 0) {
      res.status(200).json({ result: "User already registered." });
    } else {
      let query = `INSERT INTO users(email, nickname, picture) VALUES('${data.email}', '${data.nickname}', '${data.picture}');`
      let result_insert = await conn.query(query);

      query_find = `SELECT id FROM users WHERE email = '${data.email}';`;
      result_find = await conn.query(query_find);

      userID = result_find.rows[0].id;
      query = `INSERT INTO user_movies(id, watched, favorites, bookmarks) VALUES('${userID}', NULL, NULL, NULL);`
      result_insert = await conn.query(query);

      res.status(200).json({ result: "Successfully added user" });
    }

  } catch (error) {
    console.log(error);
    res.status(400);
  }
}