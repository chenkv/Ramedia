import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const token = req.body.token;

    let expiration_date = new Date(token.response.created_at * 1000);
    expiration_date.setTime(expiration_date.getTime() + (token.response.expires_in * 1000))

    const query = `UPDATE mimir.trakt_token
      SET token = '${token.response.access_token}', refresh_token = '${token.response.refresh_token}', expiration_date = '${expiration_date.toISOString()}'
      WHERE user_id=${user.id};`;
    const result = await conn.query(query);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}