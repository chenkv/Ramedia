import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    var data = req.body;

    let userID;

    let query_find = `SELECT * FROM mimir.user WHERE email = '${data.email}';`;
    let result_find = await conn.query(query_find);

    if (result_find.rowCount > 0) {
      res.status(200).json({ result: "User already registered." });
    } else {
      let query = `INSERT INTO mimir.user(email, name, picture) VALUES('${data.email}', '${data.nickname}', '${data.picture}');`;
      await conn.query(query);

      result_find = await conn.query(query_find);
      userID = result_find.rows[0].id;

      query = `INSERT INTO mimir.trakt_token(user_id, token, refresh_token, expiration_date) VALUES(${userID}, NULL, NULL, NULL);`
      await conn.query(query);

      res.status(200).json({ result: "Successfully added user" });
    }

  } catch (error) {
    console.log(error);
    res.status(400);
  }
}