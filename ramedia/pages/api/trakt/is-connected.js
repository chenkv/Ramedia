import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    let connected = false;

    const query = `SELECT token FROM mimir.trakt_token WHERE user_id=${user.id}`;
    const result = await conn.query(query);
    
    if (result.rows[0].token != null) {
      connected = true;
    }

    res.status(200).json({ is_connected: connected })
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}