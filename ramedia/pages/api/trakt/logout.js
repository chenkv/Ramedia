import conn from "../../../lib/db";

const traktID = process.env.TRAKT_ID;
const traktSecret = process.env.TRAKT_SECRET;

export default async function handler(req, res) {
  try {
    const user = req.body.user
    const query1 = `SELECT token FROM mimir.trakt_token WHERE user_id=${user.id};`;
    let tokenResponse = await conn.query(query1);

    const url = `https://api.trakt.tv/oauth/revoke`;

    let send_data = {
      "token": tokenResponse.rows[0].token,
      "client_id": traktID,
      "client_secret": traktSecret,
    }

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send_data)
    });
    response = await response.json();

    const query2 = `UPDATE mimir.trakt_token SET token = NULL, refresh_token = NULL WHERE user_id=${user.id};`;
    await conn.query(query2);

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}