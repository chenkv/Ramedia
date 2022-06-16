import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {

    var data = req.body;

    const query = `UPDATE users SET trakt_token = '${data.token.response.access_token}', trakt_refresh = '${data.token.response.refresh_token}' WHERE email = '${data.user.email}';`;
    const result = await conn.query(query);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}