const traktID = process.env.TRAKT_ID;
const baseurl = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const redirecturl = `${baseurl}/user/connect-trakt`;
    const url = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${traktID}&redirect_uri=${redirecturl}`;

    res.status(200).json({ link: url });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}