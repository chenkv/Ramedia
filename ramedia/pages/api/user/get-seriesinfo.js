import conn from "../../../lib/db";
import cache from "memory-cache";

export default async function handler(req, res) {
  try {
    const user = req.body.user;
    const showID = req.body.imdb_id;

    if (!showID || !user.id) {
      res.status(400);
      return;
    }

    let result = {tracked: false};

    let query = `SELECT * FROM mimir.bookmark WHERE user_id=${user.id} AND type='show' AND element_id='${showID}';`;
    let response = await conn.query(query);
    if (response.rowCount > 0) {
      result.tracked = true;
    }

    query = `SELECT * FROM mimir.watched_episode WHERE user_id=${user.id} AND show_id='${showID}'`
    response = await conn.query(query);
    result.watched = response.rows;


    let show_details = cache.get(`/series/${showID}`);

    if (!show_details) {
      const tmdburl = `https://api.themoviedb.org/3/find/${showID}?api_key=${tmdb_key}&language=en-US&external_source=imdb_id`;
      var showRes = await fetch(tmdburl, { method: 'GET' });
      showRes = await showRes.json();

      let idResponse = showRes.tv_results[0];
      let tmdbID = idResponse.id;

      const yearurl = `https://api.themoviedb.org/3/tv/${tmdbID}?api_key=${tmdb_key}&language=en-US`;
      show_details = await fetch(yearurl, { method: 'GET' });
      show_details = await yearRes.json();
    }

    result.finished = false;
    if (result.watched.length >= show_details.yearRes.number_of_episodes) {
      result.finished = true;
    }

    // for (let i in response.rows) {

    // }
    // result.progress = ;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}