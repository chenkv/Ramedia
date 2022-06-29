import conn from "../../../lib/db";
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const user = req.body.user;

    const query = `SELECT watched FROM user_movies WHERE id=${user.id};`;
    const result = await conn.query(query);
    console.log(result.rows[0]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}