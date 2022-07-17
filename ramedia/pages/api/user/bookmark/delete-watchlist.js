import conn from "../../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const targetID = req.body.id;

    if (!targetID) {
      res.status(400).end();
      return;
    }

    if (req.body.movie) {
      let query = `DELETE FROM mimir.bookmark WHERE user_id=${user.id} AND type='movie' AND element_id='${targetID}';`;
      await conn.query(query);
    }

    if (req.body.show) {
      let query = `DELETE FROM mimir.bookmark WHERE user_id=${user.id} AND type='show' AND element_id='${targetID}';`;
      await conn.query(query);
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}