import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    var user = req.body;

    const query = `SELECT token FROM mimir.trakt_token WHERE user_id=${user.id};`;
    const result = await conn.query(query);

    res.status(200).json({ token: result.rows[0].token });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}