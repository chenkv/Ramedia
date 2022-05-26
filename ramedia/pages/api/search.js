const tmdbKey = 'd3f71a44bd873185b851afe9c5d14849';

export default async function handler(req, res) {
    try {
        const title = req.body.title;

        var movieRes, showRes, gameRes;
        var allFalse = !(req.body.movie || req.body.show || req.body.game);

        if (req.body.movie || allFalse) {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${title}&page=1`;

            movieRes = await fetch(url, { method: 'GET' });
            movieRes = await movieRes.json();
            console.log(movieRes);
        }

        res.status(200).send({ movieRes, showRes, gameRes });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}