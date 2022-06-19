import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {

    var data = req.body;

    const query = `SELECT trakt_token FROM users WHERE id = '${data.id}';`;
    const result = await conn.query(query);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}