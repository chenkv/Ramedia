import conn from "../../../../lib/db"

export default async function handler(req, res) {
  try {
    const {
      query: { email },
    } = req
  
    const query = `SELECT * FROM mimir.user WHERE email = ${email};`;
    const result = await conn.query(query);
  
    res.status(200).json({ 'res': result.rows[0] })
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}