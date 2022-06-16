import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    var data = req.body;
    let connected = false;

    const query = `SELECT trakt_token FROM users WHERE email = '${data.email}';`;
    const result = await conn.query(query);
    
    if (result.rows[0].trakt_token != null) {
      connected = true;
    }

    res.status(200).json({ is_connected: connected })
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}