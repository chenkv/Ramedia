const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
    try {
        const title = req.body.title;

        var movieRes, showRes, gameRes;
        var allFalse = !(req.body.movie || req.body.show || req.body.game);

        if (req.body.movie || allFalse) {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${title}&page=1`;

            movieRes = await fetch(url, { method: 'GET' });
            movieRes = await movieRes.json();

            for (let index = 0; index < movieRes.results.length; index++) {
                const element = movieRes.results[index];
                const toimdburl = `https://api.themoviedb.org/3/movie/${element.id}?api_key=${tmdbKey}&language=en-US`;

                var temp = await fetch(toimdburl, { method: 'GET' });
                temp = await temp.json();
                element.imdb_id = temp.imdb_id;
            }
        }

        if (req.body.show || allFalse) {
            const url = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbKey}&language=en-US&page=1&query=${title}`;

            showRes = await fetch(url, { method: 'GET' });
            showRes = await showRes.json();

            for (let index = 0; index < showRes.results.length; index++) {
                const element = showRes.results[index];
                const toimdburl = `https://api.themoviedb.org/3/tv/${element.id}/external_ids?api_key=${tmdbKey}&language=en-US`;

                var temp = await fetch(toimdburl, { method: 'GET' });
                temp = await temp.json();
                element.imdb_id = temp.imdb_id;
            }
        }

        // if (req.body.game || allFalse) {
        //     const url = `https://api.rawg.io/api/games?search=${title}`;

        //     movieRes = await fetch(url, { method: 'GET' });
        //     movieRes = await movieRes.json();

        //     for (let index = 0; index < movieRes.results.length; index++) {
        //         const element = movieRes.results[index];
        //         const toimdburl = `https://api.themoviedb.org/3/movie/${element.id}?api_key=${tmdbKey}&language=en-US`;

        //         var temp = await fetch(toimdburl, { method: 'GET' });
        //         temp = await temp.json();
        //         element.imdb_id = temp.imdb_id;
        //     }
        // }

        res.status(200).send({ movieRes, showRes, gameRes });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}