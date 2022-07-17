import conn from "../../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const showID = req.body.id;
    const season = req.body.season;
    const episode = req.body.episode;
    const date = req.body.date;

    let query = `INSERT INTO mimir.watched_episode(user_id, show_id, season, episode, date) VALUES(${user.id}, '${showID}', ${season}, ${episode}, '${date}');`;
    await conn.query(query);

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}