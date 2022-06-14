import conn from "../../lib/db";

export default async function handler(req, res) {
  try {
    const query = `INSERT INTO user_info(id, liked) VALUES('1234', ARRAY ['tt6710474']);`;
    const result = await conn.query(
      query
    );

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}