import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {

    var data = req.body;

    const query_find = `SELECT * FROM users WHERE email = '${data.email}';`;
    const result_find = await conn.query(query_find);
    if (result_find.rows[0]) {
      res.status(200).json({ result: "User already registered." });
    } else {
      const query = `INSERT INTO users(email, nickname, picture) VALUES('${data.email}', '${data.nickname}', '${data.picture}');`
      const result_insert = await conn.query(query);
      res.status(200).json({ result: result_insert });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}