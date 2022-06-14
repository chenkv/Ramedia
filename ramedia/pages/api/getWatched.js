import conn from "../../lib/db";

export default async function handler(req, res) {
  try {
    const query = "SELECT * FROM user_info;";
    const result = await conn.query(
      query
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}