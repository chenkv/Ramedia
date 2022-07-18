import conn from "../../../lib/db";
const trakt_client_id = process.env.TRAKT_ID;
const base = process.env.BASE_URL;

export default async function handler(req, res) {
  try {

    if (req.method === 'POST') {
      const type = req.query.type;
      let trakt_token;

      const user = req.body.user;
      let token_query = `SELECT token FROM mimir.trakt_token WHERE user_id=${user.id};`;
      let token_result = await conn.query(token_query);
      if (token_result.rows[0].token) {
        trakt_token = token_result.rows[0].token;
      }

      if (type == 'movie') {
        /*
          format of body:
          {
            user: (user object),
            imdb_id: (string),
            date: (date in iso string format)
          }
        */

        const movieID = req.body.imdb_id;
        const date = req.body.date;
    
        let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND type='movie' AND element_id='${movieID}';`;
        let response = await conn.query(query);
        if (response.rowCount > 0) {
          let delete_query = `DELETE FROM mimir.bookmark WHERE user_id=${user.id} AND type='movie' AND element_id='${movieID}';`;
          response = await conn.query(delete_query);
        }
    
        query = `INSERT INTO mimir.watched_movie(user_id, movie_id, date) VALUES('${user.id}', '${movieID}', '${date}');`;
        response = await conn.query(query);

        if (trakt_token) {
          let episode_object = await fetch(`https://api.trakt.tv/search/imdb/${movieID}?type=movie`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'trakt-api-version': 2,
              'trakt-api-key': trakt_client_id
            }
          })
          episode_object = await episode_object.json();

          let send_data = {
            'movies': [
              episode_object[0].movie
            ]
          }
          send_data.movies[0].watched_at = date;

          await fetch(`https://api.trakt.tv/sync/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + trakt_token,
              'trakt-api-version': '2',
              'trakt-api-key': trakt_client_id
            },
            body: JSON.stringify(send_data)
          });
        }
    
        res.status(200).end();
        return;
      }

      if (type == 'show') {
        res.status(400).json({ error: 400, message: "", detail: "" });
        return;
      }

      if (type == 'season') {
        res.status(400).json({ error: 400, message: "", detail: "" });
        return;        
      }

      if (type == 'episode') {
        /*
          format of body:
          {
            user: (user object),
            id: (string),
            season: (int),
            episode: (int),
            date: (date in iso string format)          
          }
        */

        const showID = req.body.show_id;
        const episodeID = req.body.episode_id;
        const season = req.body.season;
        const episode = req.body.episode;
        const date = req.body.date;
    
        let query = `INSERT INTO mimir.watched_episode(user_id, show_id, season, episode, date) VALUES(${user.id}, '${showID}', ${season}, ${episode}, '${date}');`;
        await conn.query(query);

        if (trakt_token) {
          let episode_object = await fetch(`https://api.trakt.tv/search/tmdb/${episodeID}?type=episode`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'trakt-api-version': 2,
              'trakt-api-key': trakt_client_id
            }
          })
          episode_object = await episode_object.json();

          let send_data = {
            'episodes': [
              episode_object[0].episode
            ]
          }
          send_data.episodes[0].watched_at = date;

          await fetch(`https://api.trakt.tv/sync/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + trakt_token,
              'trakt-api-version': '2',
              'trakt-api-key': trakt_client_id
            },
            body: JSON.stringify(send_data)
          });
        }

        res.status(200).end();
        return;
      }

      if (type == 'game') {
        res.status(400).json({ error: 400, message: "Game endpoints currently not supported.", detail: "The game details are currently incomplete." });
        return;
      }
    }

    if (req.method === 'GET') {

    }

    res.status(400).json({ error: 400, message: "Invalid REST method", detail: "" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 400, message: "Invalid request", detail: "" });
  }
}