const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=59'
  )

  try {
    const showData = req.body;

    const season = `https://api.themoviedb.org/3/tv/${showData.id}/season/${showData.season_num}?api_key=${tmdbKey}&language=en-US`;
    var seasonRes = await fetch(season, { method: 'GET' });
    seasonRes = await seasonRes.json();
    
    // const idurl = `https://api.themoviedb.org/3/tv/${result.id}/external_ids?api_key=${tmdbKey}&language=en-US`
    // var idRes = await fetch(idurl, { method: 'GET' });
    // idRes = await idRes.json();

    res.status(200).json({ seasonRes });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}