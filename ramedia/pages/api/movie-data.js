const tmdbKey = process.env.TMDB_KEY;
const fanartKey = process.env.FANARTTV_KEY;

export default async function handler(req, res) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=86400, stale-while-revalidate=59'
    )

    try {
        const id = req.query.imdb_id;

        if (!id) {
            res.status(400).json({
                error: {
                    status: 400,
                    message: "movie's imdb id not provided"
                }
            });
            return;
        }

        const tmdburl = `https://api.themoviedb.org/3/find/${id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id&append_to_response=release_dates,keywords`;
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
            return;
        }

        const arturl = `http://webservice.fanart.tv/v3/movies/${result.id}?api_key=${fanartKey}`;
        var artRes = await fetch(arturl, { method: 'GET' });
        artRes = await artRes.json();

        const genreurl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}&language=en-US`;
        var genreRes = await fetch(genreurl, { method: 'GET' });
        genreRes = await genreRes.json();

        const yearurl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=en-US&append_to_response=release_dates`;
        var yearRes = await fetch(yearurl, { method: 'GET' });
        yearRes = await yearRes.json();

        const creditsurl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbKey}&language=en-US`;
        var creditsRes = await fetch(creditsurl, { method: 'GET' });
        creditsRes = await creditsRes.json();

        res.status(200).json({ result, artRes, genreRes, yearRes, creditsRes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}