const tmdbKey = process.env.TMDB_KEY;
const fanartKey = process.env.FANARTTV_KEY;

export default async function handler(req, res) {
    try {
        const id = req.query.imdb_id;

        if (!id) {
            res.status(400).json({
                error: {
                    status: 400,
                    message: "series' imdb id not provided"
                }
            });
        }

        const tmdburl = `https://api.themoviedb.org/3/find/${id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`;
        var showRes = await fetch(tmdburl, { method: 'GET' });
        showRes = await showRes.json();

        var result = showRes.tv_results[0];

        if (!result) {
            res.status(400).json({
                error: {
                    status: 400,
                    message: "invalid imdb series id"
                }
            });
        }
        
        const idurl = `https://api.themoviedb.org/3/tv/${result.id}/external_ids?api_key=${tmdbKey}&language=en-US`
        var idRes = await fetch(idurl, { method: 'GET' });
        idRes = await idRes.json();

        const arturl = `http://webservice.fanart.tv/v3/tv/${idRes.tvdb_id}?api_key=${fanartKey}`;
        var artRes = await fetch(arturl, { method: 'GET' });
        artRes = await artRes.json();

        res.status(200).json({ result, artRes });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}