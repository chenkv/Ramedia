const tmdbKey = process.env.TMDB_KEY;
const fanartKey = process.env.FANARTTV_KEY;

export default async function handler(req, res) {
    try {
        const id = req.query.imdb_id;

        if (!id) {
            res.status(400).json({
                error: {
                    status: 400,
                    message: "movie's imdb id not provided"
                }
            });
        }

        const tmdburl = `https://api.themoviedb.org/3/find/${id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`;
        var movieRes = await fetch(tmdburl, { method: 'GET' });
        movieRes = await movieRes.json();

        var result = movieRes.movie_results[0];

        if (!result) {
            res.status(400).json({
                error: {
                    status: 400,
                    message: "invalid imdb movie id"
                }
            });
        }

        const arturl = `http://webservice.fanart.tv/v3/movies/${result.id}?api_key=${fanartKey}`;
        var artRes = await fetch(arturl, { method: 'GET' });
        artRes = await artRes.json();

        res.status(200).json({ result, artRes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}