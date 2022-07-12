const traktID = process.env.TRAKT_ID;
const base = process.env.BASE_URL;

// INCOMPLETE

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    };

    let response = await fetch(`${base}/api/trakt/get-dbtoken`, options);
    response = await response.json();
    let token = response.rows[0].trakt_token;

    let response1 = await fetch(`https://api.trakt.tv/sync/history/movies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'trakt-api-version': '2',
        'trakt-api-key': traktID
      }
    });

    // response1 = await response1.json();

    res.status(200).json(response1);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}