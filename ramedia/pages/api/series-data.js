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
        let tmdbID = result.id;

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

        const genreurl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${tmdbKey}&language=en-US`;
        var genreRes = await fetch(genreurl, { method: 'GET' });
        genreRes = await genreRes.json();

        const yearurl = `https://api.themoviedb.org/3/tv/${tmdbID}?api_key=${tmdbKey}&language=en-US&append_to_response=content_ratings`;
        var yearRes = await fetch(yearurl, { method: 'GET' });
        yearRes = await yearRes.json();

        const creditsurl = `https://api.themoviedb.org/3/tv/${tmdbID}/credits?api_key=${tmdbKey}&language=en-US`;
        var creditsRes = await fetch(creditsurl, { method: 'GET' });
        creditsRes = await creditsRes.json();

        res.status(200).json({ result, artRes, genreRes, yearRes, creditsRes });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}