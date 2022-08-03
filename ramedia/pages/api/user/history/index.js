import conn from "../../../../lib/db";
import cache from "memory-cache";

const trakt_client_id = process.env.TRAKT_ID;
const tmdb_key = process.env.TMDB_KEY;

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
        const showID = req.body.imdb_id;
        const currDate = new Date().toISOString();

        let show_details = cache.get(`/series/${showID}`);

        if (!show_details) {
          const tmdburl = `https://api.themoviedb.org/3/find/${showID}?api_key=${tmdb_key}&language=en-US&external_source=imdb_id`;
          var showRes = await fetch(tmdburl, { method: 'GET' });
          showRes = await showRes.json();

          var result = showRes.tv_results[0];
          let tmdbID = result.id;

          const yearurl = `https://api.themoviedb.org/3/tv/${tmdbID}?api_key=${tmdb_key}&language=en-US`;
          show_details = await fetch(yearurl, { method: 'GET' });
          show_details = await yearRes.json();
        }

        let watched_episodes = await conn.query(`SELECT * FROM mimir.watched_episode WHERE user_id=${user.id} AND show_id='${showID}';`);

        for (let i of show_details.yearRes.seasons) {
          if (i.season_number > 0) {
            for (let j = 1; j <= i.episode_count; j++) {
              if (!!!watched_episodes.rows.find(currEp => { return (currEp.season == i.season_number) && (currEp.episode == j) })) {
                let query = `INSERT INTO mimir.watched_episode(user_id, show_id, season, episode, date) VALUES(${user.id}, '${showID}', ${i.season_number}, ${j}, '${currDate}');`;
                await conn.query(query);
              }
            }
          }
        }

        if (trakt_token) {
          let show_object = await fetch(`https://api.trakt.tv/search/imdb/${showID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'trakt-api-version': 2,
              'trakt-api-key': trakt_client_id
            }
          })

          show_object = await show_object.json();

          let send_data = {
            'shows': [
              show_object[0].show
            ]
          }
          send_data.shows[0].watched_at = currDate;

          let trakt_response = await fetch(`https://api.trakt.tv/sync/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + trakt_token,
              'trakt-api-version': '2',
              'trakt-api-key': trakt_client_id
            },
            body: JSON.stringify(send_data)
          });

          // Add more error response handlers for trakt.tv stuff
          if (trakt_response.status != 201) {
            res.status(500).json({ error: "trakt_1", message: "Unable to add to trakt.tv history", detail: "The episode was added to history but unable to sync with Trakt.tv history." });
            return;
          }
        }

        res.status(200).end();
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

          let trakt_response = await fetch(`https://api.trakt.tv/sync/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + trakt_token,
              'trakt-api-version': '2',
              'trakt-api-key': trakt_client_id
            },
            body: JSON.stringify(send_data)
          });

          // Add more error response handlers for trakt.tv stuff
          if (trakt_response.status != 201) {
            res.status(500).json({ error: "trakt_1", message: "Unable to add to trakt.tv history", detail: "The episode was added to history but unable to sync with Trakt.tv history." });
            return;
          }
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
      const user = req.query.user;
      
      let movies = [];
      let movie_query = `SELECT * FROM mimir.watched_movie WHERE user_id=${user};`;
      let movie_response = await conn.query(movie_query);

      if (movie_response.rowCount > 0) {
        for (let i = 0; i < movie_response.rows.length; i++) {
          let element = movie_response.rows[i];
    
          let curr = await fetch(`https://api.themoviedb.org/3/find/${element.movie_id}?api_key=${tmdb_key}&language=en-US&external_source=imdb_id`, { method: 'GET' });
          curr = await curr.json();
    
          movies.push({
            id: element.movie_id,
            details: curr.movie_results[0]
          });
        }
      }

      // let episodes = [];
      // let show_query = `SELECT * FROM mimir.watched_episode WHERE user_id=${user};`;
      // let show_response = await conn.query(show_query);

      // if (show_response.rowCount > 0) {
      //   for (let i = 0; i < show_response.rows.length; i++) {
      //     let element = show_response.rows[i];


      //   }
      // }

      res.status(200).json({ movies });
      return;
    }

    res.status(400).json({ error: 400, message: "Invalid REST method", detail: "" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 400, message: "Invalid request", detail: "" });
  }
}