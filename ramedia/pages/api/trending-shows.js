const traktID = process.env.TRAKT_ID;
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

        const url2 = 'https://api.trakt.tv/shows/watched/weekly?limit=10';

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
            const element = popular[i].show;

            var currId = element.ids.tmdb;
            var currURL = `https://api.themoviedb.org/3/tv/${currId}?api_key=${tmdbKey}&language=en-US&append_to_response=content_ratings`;
            var imageResponse = await fetch(currURL, { method: 'GET' })
            var temp = await imageResponse.json();

            element.imageurl = "https://image.tmdb.org/t/p/original" + temp.backdrop_path;
            element.details = temp;
        }

        const url3 = 'https://api.trakt.tv/shows/anticipated?limit=20';

        var anticipatedRes = await fetch(url3, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktID
            }
        })

        var anticipated = await anticipatedRes.json();

        for (let i = 0; i < anticipated.length; i++) {
            const element = anticipated[i].show;

            var currId = element.ids.tmdb;
            var currURL = `https://api.themoviedb.org/3/tv/${currId}?api_key=${tmdbKey}&language=en-US`;
            var imageRes = await fetch(currURL, { method: 'GET' });
            var temp = await imageRes.json();

            element.imageurl = "https://image.tmdb.org/t/p/original" + temp.backdrop_path;
            element.details = temp;
        }

        res.status(200).json({ trending, popular, anticipated })
    } catch (err) {
        console.log("ERROR!: " + err);
        res.status(500).json({ error: 'failed to load data' })
    }
}