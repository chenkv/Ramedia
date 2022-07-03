import cache from "memory-cache"

const rawgkey = process.env.RAWG_KEY;

export default async function handler(req, res) {
  try {
    const cachedResponse = cache.get('/api/trending-games');

    if (cachedResponse) {
      console.log("Data was cached!");
      res.status(200).json({ trending: cachedResponse })
    } else {
      console.log("Fetching new data!");
      const url = `https://api.rawg.io/api/games?key=${rawgkey}&ordering=-added&page_size=10`;

      var trending = await fetch(url, { method: 'GET' });
      trending = await trending.json();

      for (let i = 0; i < trending.results.length; i++) {
        const element = trending.results[i];

        var currId = element.id;
        var currURL = `https://api.rawg.io/api/games/${currId}?key=${rawgkey}`;
        var descriptionRes = await fetch(currURL, { method: 'GET' })
        descriptionRes = await descriptionRes.json();
        element.description = descriptionRes;
      }

      const hours = 24;
      cache.put('/api/trending-games', trending, hours * 1000 * 60 * 60);

      res.status(200).json({ trending })
    }
  } catch (err) {
    console.log("ERROR!: " + err);
    res.status(500).json({ error: 'failed to load data' })
  }
}