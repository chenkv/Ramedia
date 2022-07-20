import conn from "../../../../lib/db";

export default async function handler(req, res) {
  try {
    const list_id = req.query.id;

    if (req.method === 'POST') {
      const mediaID = req.body.media_id;

      let query = `UPDATE mimir.list SET elements = array_append(elements,'${mediaID}') WHERE id=${list_id};`;
      await conn.query(query);

      res.status(200).end();
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 400, message: "Invalid request", detail: "" });
  }
}