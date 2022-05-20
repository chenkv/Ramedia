const id = 'a06f9c2d9393e89eb2c7a4c7dc3a581d30fd78ce9f73904c232e5bf6b114feac';
const tmdbKey = 'd3f71a44bd873185b851afe9c5d14849';

export default async function handler(req, res) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=86400, stale-while-revalidate=59'
    )

    try {
        const url = 'https://api.trakt.tv/movies/trending?limit=20';

        var popularRes = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': id
            }
        })
        
        var data = await popularRes.json();
        console.log(data)

        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            var currId = element.movie.ids.tmdb;
            var currURL = `https://api.themoviedb.org/3/movie/${currId}?api_key=${tmdbKey}&language=en-US`;
            var imageResponse = await fetch(currURL, { method: 'GET' })
            var data2 = await imageResponse.json();

            element.movie.imageurl = "https://image.tmdb.org/t/p/original" + data2.poster_path;
        }

        res.status(200).json({ data })
    } catch (err) {
        res.status(500).json({ error: 'failed to load data' })
    }
}