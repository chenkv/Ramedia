const traktID = process.env.TRAKT_ID;

export default async function handler(req, res) {
  try {
    const redirecturl = 'http://localhost:3000/profile';
    const url = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${traktID}&redirect_uri=${redirecturl}`;

    res.status(200).json({ link: url });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}