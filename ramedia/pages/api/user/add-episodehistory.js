import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const showID = req.body.id;
    const season = req.body.season;
    const episode = req.body.episode;

    let query = `SELECT shows FROM user_shows WHERE id=${user.id};`;
    const response = await conn.query(query);

    if (response.rows[0].shows) {
      for (let i = 0; i < response.rows[0].shows.length; i++) {
        let element = response.rows[0].shows[i];

        if (element.imdb_id == showID) {
          for (let j in element.seasons) {
            if ((j.season == season) && (j.watched.includes(episode))) {
              res.status(400).json({ error: "Episode already added to watchlist" });
              return;
            }
          }
        }
      }
    }

    query = `UPDATE user_shows SET shows = jsonb_set(shows::jsonb, '{seasons,${season - 1},watched}', shows#>{seasons,${season - 1},watched} || ${episode}, true) WHERE id=${user.id};`;
    let result = await conn.query(query);

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}