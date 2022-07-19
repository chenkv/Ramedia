import conn from "../../../../lib/db";
const trakt_client_id = process.env.TRAKT_ID;
const tmdb_key = process.env.TMDB_KEY;

export default async function handler(req, res) {
  try {

    if (req.method === 'POST') {
      const user = req.body.user;
      const name = req.body.name;
      const description = req.body.description;

      let query = `INSERT INTO mimir.list(user_id, name, description, elements) VALUES(${user.id}, '${name}', '${description}', NULL);`;
      await conn.query(query);

      res.status(200).end();
      return;
    }

    if (req.method === 'GET') {
      const user = req.query.user;

      let query = `SELECT * FROM mimir.list WHERE user_id=${user};`;
      let response = await conn.query(query);

      console.log(response)

      res.status(200).json({ lists: response.rows });
      return;
    }

    res.status(400).json({ error: 400, message: "Invalid REST method", detail: "" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 400, message: "Invalid request", detail: "" });
  }
}