const traktID = process.env.TRAKT_ID;
const traktSecret = process.env.TRAKT_SECRET;
const base = process.env.BASE_URL;

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
    let token = response.token;

    if (req.body.movie) {
      let movies = await fetch(`https://api.trakt.tv/search/imdb/${req.body.imdb_id}?type=movie`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': 2,
          'trakt-api-key': traktID
        }
      })
      movies = await movies.json();

      let send_data = {
        'movies': [
          movies[0].movie
        ]
      }
      send_data.movies[0].watched_at = req.body.date;

      let response1 = await fetch(`https://api.trakt.tv/sync/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'trakt-api-version': '2',
          'trakt-api-key': traktID
        },
        body: JSON.stringify(send_data)
      });
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}