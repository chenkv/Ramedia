const traktID = process.env.TRAKT_KEY;
const tmdbKey = process.env.TMDB_KEY;

export default async function handler(req, res) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=86400, stale-while-revalidate=59'
    )

    try {
        const url = 'https://api.trakt.tv/shows/trending?limit=20';

        var trendingRes = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': traktID
            }
        })
        
        var trending = await trendingRes.json();

        for (let i = 0; i < trending.length; i++) {
            const element = trending[i];

            var currId = element.show.ids.tmdb;
            var currURL = `https://api.themoviedb.org/3/tv/${currId}?api_key=${tmdbKey}&language=en-US`;
            var imageResponse = await fetch(currURL, { method: 'GET' })
            var temp = await imageResponse.json();

            element.show.imageurl = "https://image.tmdb.org/t/p/w300" + temp.poster_path;
        }

        const url2 = 'https://api.trakt.tv/shows/popular?limit=10';

        var popularRes = await fetch(url2, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktID
            }
        })

        var popular = await popularRes.json();

        for (let i = 0; i < popular.length; i++) {
            const element = popular[i];

            var currId = element.ids.tmdb;
            var currURL = `https://api.themoviedb.org/3/tv/${currId}?api_key=${tmdbKey}&language=en-US`;
            var imageResponse = await fetch(currURL, { method: 'GET' })
            var temp = await imageResponse.json();

            element.imageurl = "https://image.tmdb.org/t/p/original" + temp.backdrop_path;
        }

        res.status(200).json({ trending, popular })
    } catch (err) {
        console.log("ERROR!: " + err);
        res.status(500).json({ error: 'failed to load data' })
    }
}