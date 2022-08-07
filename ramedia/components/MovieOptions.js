import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import styles from '../styles/MovieOptions.module.css'
import ListPopup from "./ListPopup";

export default function MovieOptions({ user, movieID }) {
  const [ info, setInfo ] = useState(null);
  const [ watchlistRoot, setWatchlistRoot ] = useState(null);
  const [ seenRoot, setSeenRoot ] = useState(null);
  const [ listPopup, setListPopup ] = useState(false);

  useEffect(() => {
    if (user.user) {
      if (!watchlistRoot) {
        setWatchlistRoot(createRoot(document.getElementById("watchlistButton")));
      }
      if (!seenRoot) {
        setSeenRoot(createRoot(document.getElementById("seenButton")));
      }
    }
  }, [])

  useEffect(() => {
    async function getUserInfo() {
      if (!user.isLoading && movieID) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        var body = {
          user: userInfo.res,
          imdb_id: movieID,
        }
    
        const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        };
    
        let res = await fetch(`/api/user/get-movieinfo`, options);
        res = await res.json();
        console.log(res)
        setInfo(res);
      }
    }

    getUserInfo();
  }, [user.isLoading, user.user, movieID])

  if (user.user == null) {
    return (
      <div className="text-center">
        <p className="text-2xl font-semibold">Login to keep track of your movie habits!</p>
      </div>
    );
  }

  async function addToHistory() {
    let button = document.getElementById("seenButton");
    let icon = document.getElementById("seenicon");

    icon.classList.add(styles.fadeOut);

    seenRoot.render(<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-12 w-12" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>);
    button.disabled = true;
    
    if (!info.watched) {
      var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
      userInfo = await userInfo.json();

      let dateTime = new Date().toISOString();

      var body = {
        user: userInfo.res,
        imdb_id: movieID,
        date: dateTime
      }

      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };

      await fetch('/api/user/history?type=movie', options);
      button.disabled = false;

      seenRoot.render(
        <svg id="seenicon" xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#00BF60">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )

      let temp = info;
      temp.watched = !info.watched;
      setInfo(temp);
      console.log(info);
    } else {
      // var body = {
      //   user: userInfo.res,
      //   id: movieID
      // }

      // const options = {
      //   method: 'POST',
      //   headers: {
      //       'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(body)
      // };

      // await fetch('/api/user/delete-watchlist', options);
      // button.disabled = false;

      // seenRoot.render(
      //   <svg id="seenicon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className={`h-12 w-12 ${styles.fadeIn}`}
      //     preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ff971d" d="M19.447 5.345A3.27
      //     3.27 0 0 0 16.29 3a3.293 3.293 0 0 0-3.277 3h-2.025a3.297 3.297 0 0 0-3.284-3a3.268 3.268 0 0 0-3.151
      //     2.345l-2.511 8.368A1.027 1.027 0 0 0 2 14v1a5.006 5.006 0 0 0 5.001 5a5.003 5.003 0 0 0 4.576-3h.846a5.003
      //     5.003 0 0 0 4.576 3A5.006 5.006 0 0 0 22 14.999V14c0-.098-.015-.194-.042-.287l-2.511-8.368zM7.001 18A3.005
      //     3.005 0 0 1 4 15c0-.076.017-.147.022-.222A2.995 2.995 0 0 1 7 12a3 3 0 0 1 3 3v.009A3.004 3.004 0 0 1 7.001
      //     18zm9.998 0A3.004 3.004 0 0 1 14 15.009V15a3 3 0 0 1 6-.001A3.005 3.005 0 0 1 16.999 18z"/></svg>
      // )
    }
  }

  async function addToWatchlist() {
    let button = document.getElementById("watchlistButton");
    let icon = document.getElementById("watchicon");

    icon.classList.add(styles.fadeOut);

    watchlistRoot.render(<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-12 w-12" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>);
    button.disabled = true;

    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    if (!info.bookmarked) {
      var body = {
        user: userInfo.res,
        imdb_id: movieID,
        movie: true
      }

      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };

      let res = await fetch('/api/user/bookmark/add-watchlist', options);
      if (res.status != 200) {
        button.disabled = false;
        watchlistRoot.render(
          <svg id="watchicon" xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#ff971d">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        )
        return;
      }
      button.disabled = false;

      watchlistRoot.render(
        <svg id="watchicon" xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#00BF60">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    } else {
      var body = {
        user: userInfo.res,
        id: movieID,
        movie: true
      }

      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };

      await fetch('/api/user/bookmark/delete-watchlist', options);
      button.disabled = false;

      watchlistRoot.render(
        <svg id="watchicon" xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#ff971d">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      )
    }

    let temp = info;
    temp.bookmarked = !info.bookmarked;
    setInfo(temp);
    console.log(info);
  }

  async function handleList() {
    setListPopup(!listPopup);
  }

  return (
    <div className='grow flex flex-row justify-center items-center'>
      <div className='flex flex-col justify-center items-center w-3/12'>
        <button id="seenButton" className='bg-[#FFE8D6] p-2 rounded-full' onClick={e => addToHistory()}>
          {
            function () {
              if (!info || !info.watched) {
                return (
                  <svg id="seenicon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className='w-12 h-12'
                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ff971d" d="M19.447 5.345A3.27
                    3.27 0 0 0 16.29 3a3.293 3.293 0 0 0-3.277 3h-2.025a3.297 3.297 0 0 0-3.284-3a3.268 3.268 0 0 0-3.151
                    2.345l-2.511 8.368A1.027 1.027 0 0 0 2 14v1a5.006 5.006 0 0 0 5.001 5a5.003 5.003 0 0 0 4.576-3h.846a5.003
                    5.003 0 0 0 4.576 3A5.006 5.006 0 0 0 22 14.999V14c0-.098-.015-.194-.042-.287l-2.511-8.368zM7.001 18A3.005
                    3.005 0 0 1 4 15c0-.076.017-.147.022-.222A2.995 2.995 0 0 1 7 12a3 3 0 0 1 3 3v.009A3.004 3.004 0 0 1 7.001
                    18zm9.998 0A3.004 3.004 0 0 1 14 15.009V15a3 3 0 0 1 6-.001A3.005 3.005 0 0 1 16.999 18z"/></svg>
                )
              } else {
                return (
                  <svg id="seenicon" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="#00BF60">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )
              }
            } ()
          }
        </button>
        <h3 className='text-lg font-semibold'>Seen</h3>
      </div>

      <div className='flex flex-col justify-center items-center w-3/12'>
        <button id="watchlistButton" className='bg-[#FFE8D6] p-2 rounded-full' onClick={e => addToWatchlist()} >
          {
            function () {
              if (!info || !info.bookmarked) {
                return (
                  <svg id="watchicon" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="#ff971d">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                )
              } else {
                return (
                  <svg id="watchicon" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="#00BF60">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )
              }
            } ()
          }
        </button>
        <h3 className='text-lg font-semibold'>Watchlist</h3>
      </div>

      <div className='flex flex-col justify-center items-center w-3/12 relative'>
        <button id="listButton" className='bg-[#FFE8D6] p-2 rounded-full' onClick={e => handleList()} >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 20 20" fill="#ff971d">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </button>
        <h3 className='text-lg font-semibold'>Lists</h3>

        <ListPopup enabled={listPopup} handleList={handleList} id={movieID} user={user} />
      </div>
    </div>
  )

}