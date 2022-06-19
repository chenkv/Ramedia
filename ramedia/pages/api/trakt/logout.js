import conn from "../../../lib/db";

const traktID = process.env.TRAKT_ID;
const traktSecret = process.env.TRAKT_SECRET;

export default async function handler(req, res) {
  try {
    let data = req.body;
    const query1 = `SELECT trakt_token FROM users WHERE email = '${data.email}';`;
    let tokenResponse = await conn.query(query1);

    const url = `https://api.trakt.tv/oauth/revoke`;

    let send_data = {
      "token": tokenResponse.rows[0].trakt_token,
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

    const query2 = `UPDATE users SET trakt_token = NULL, trakt_refresh = NULL WHERE email = '${data.email}';`;
    let deleteResponse = await conn.query(query2);

    res.status(200).json({ message: "SUCCESS!" });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}