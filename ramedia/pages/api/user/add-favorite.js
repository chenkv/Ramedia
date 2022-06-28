import conn from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `UPDATE user_movies SET favorites = array_append(favorites, '${req.body.imdb_id}') WHERE id=${user.id};`;
    const result = await conn.query(query);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}