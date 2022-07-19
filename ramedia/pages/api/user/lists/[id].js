import conn from "../../../../lib/db";
const trakt_client_id = process.env.TRAKT_ID;
const tmdb_key = process.env.TMDB_KEY;

export default async function handler(req, res) {
  try {
    const list_id = req.query;

    if (req.method === 'POST') {

    }
  } catch {
    console.log(error);
    res.status(400).json({ error: 400, message: "Invalid request", detail: "" });
  }
}