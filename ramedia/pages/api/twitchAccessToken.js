const id = 'sre0tw7zr2jw0o93np2tkhz1ctfx9x';
const secret = 'adv7h6ux2k1nbilnjwquen043f45qw';

export default async function handler(req, res) {
  try {
    const oauthurl = `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=${client_credentials}`;
    var response = await fetch(oauthurl, { method: 'POST' });
    response = await response.json();

    const arturl = `http://webservice.fanart.tv/v3/movies/${result.id}?api_key=${fanartKey}`;
    var artRes = await fetch(arturl, { method: 'GET' });
    artRes = await artRes.json();

    res.status(200).json({ result, artRes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}