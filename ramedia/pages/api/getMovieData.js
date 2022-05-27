const tmdbKey = 'd3f71a44bd873185b851afe9c5d14849';
const fanartKey = 'd99e88cae3036d575de12899bccc9436';

export default async function handler(req, res) {
    try {
        const id = req.query.imdb_id;

        const tmdburl = `https://api.themoviedb.org/3/find/${id}?api_key=${tmdbKey}&language=en-US&external_source=imdb_id`;
        var movieRes = await fetch(tmdburl, { method: 'GET' });
        movieRes = await movieRes.json();

        var result = movieRes.movie_results[0];

        const arturl = `http://webservice.fanart.tv/v3/movies/${result.id}?api_key=${fanartKey}`;
        var artRes = await fetch(arturl, { method: 'GET' });
        artRes = await artRes.json();

        res.status(200).json({ result, artRes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}