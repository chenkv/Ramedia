import conn from "../../../lib/db";

const traktID = process.env.TRAKT_ID;
const traktSecret = process.env.TRAKT_SECRET;

export default async function handler(req, res) {
  try {
    const url = `https://api.trakt.tv/oauth/token`;
    console.log(req.body.user_code);

    let send_data = {
      "code": req.body.user_code,
      "client_id": traktID,
      "client_secret": traktSecret,
      "redirect_uri": 'http://localhost:3000/profile',
      "grant_type": "authorization_code"
    }

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send_data)
    });
    response = await response.json();



    res.status(200).json({ response });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}