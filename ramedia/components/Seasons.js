import Image from "next/image";
import EpisodePopup from "./EpisodePopup";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import styles from '../styles/MovieOptions.module.css';

export default function Seasons({ user, showData, showID, info, infoHandler }) {
  const [ episodeEnabled, setEpisodeEnabled ] = useState(false);
  const [ currEpisode, setCurrEpisode ] = useState(null);
  const [ currEpisodeRoot, setCurrEpisodeRoot ] = useState(null);

  useEffect(() => {
    if (episodeEnabled) {
      let popupdiv = document.getElementById("popup");
      if (popupdiv) {
        popupdiv.style.top = window.scrollY + 'px';
      }
    }
  }, [episodeEnabled])

  if (!showData) return;

  // console.log(showData);

  // This creates the tabs for each season
  let result = [];
  for (let i = 1; i <= showData.number_of_seasons; i++) {
    let curr = (
      <button id={i} key={i}
        className="px-4 py-1.5 hover:bg-[#FF971D] hover:bg-opacity-60 focus:bg-[#FF971D] cursor-pointer rounded-t-xl"
        onClick={() => handleSeasonClick(i)}
      >
        <h3 className="font-semibold tracking-wider">Season {i}</h3>
      </button>
    )

    result.push(curr);
  }

  // This handles when the user clicks on each seasons
  async function handleSeasonClick(season_number) {
    // If the season is already selected, then don't do anything
    if (document.getElementById(season_number).classList.contains("selected")) {
      return;
    }

    // Loops through all the possible seasons, adding and removing the necessary classes
    for (let i = 1; i <= showData.number_of_seasons; i++) {
      if (i == season_number) {
        document.getElementById(season_number).classList.add("bg-[#FF971D]");
        document.getElementById(season_number).classList.add("selected");
      } else {
        document.getElementById(i).classList.remove("bg-[#FF971D]");
        document.getElementById(i).classList.remove("selected");
      }
    }

    // Creates the JSX for each episode of the selected season
    let episodes = [];
    let number_of_episodes = 0;

    // Find the number of episodes in the selected season
    for (let i of showData.seasons) {
      if (i.season_number == season_number) {
        number_of_episodes = i.episode_count;
      }
    }

    // Retrieve the data for each episode of the selected season
    const JSONdata = JSON.stringify({
      id: showData.id,
      season_num: season_number,
      episode_num: number_of_episodes
    });
    const endpoint = '/api/get-season';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONdata,
    }

    var response = await fetch(endpoint, options);
    response = await response.json();

    console.log(response);

    // Loop through each episode and create the corresponding JSX for it
    for (let i of response.seasonRes.episodes) {
      let curr = (
        <div key={i.name} className="flex flex-col card w-52">
          <div className='relative w-52 h-52 mt-2 flex-none cursor-pointer rounded-3xl hover:ring-4 ring-[#FF971D] transition-all ease-linear duration-200' onClick={() => handleEpisodeClick(i)}>
            <Image
              src={"https://image.tmdb.org/t/p/w500" + i.still_path}
              alt={i.name}
              layout='fill'
              objectFit='cover'
              quality={100}
              className='rounded-3xl' />
          </div>

          <div className="text-left w-full">
            <div className="flex mt-2">
              <h4 className="grow mt-2 font-semibold text-xl">
                {"Episode " + i.episode_number}
              </h4>
              <button id={`seenbutton${i.episode_number}`} className='bg-[#FFE8D6] p-1.5 w-min rounded-full cursor-pointer mr-2' onClick={() => addToHistory(i)}>
                  {
                    function () {
                      let isWatched = false;
    
                      for (let index = 0; index < info.watched.length; index++) {
                        const element = info.watched[index];
                        
                        if ((element.season == i.season_number) && (element.episode == i.episode_number)) {
                          isWatched = true;
                          break;
                        }
                      }
    
                      if (!info || !isWatched) {
                        return (
                          <svg id={`seenicon${i.episode_number}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className='w-8 h-8'
                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ff971d" d="M19.447 5.345A3.27
                            3.27 0 0 0 16.29 3a3.293 3.293 0 0 0-3.277 3h-2.025a3.297 3.297 0 0 0-3.284-3a3.268 3.268 0 0 0-3.151
                            2.345l-2.511 8.368A1.027 1.027 0 0 0 2 14v1a5.006 5.006 0 0 0 5.001 5a5.003 5.003 0 0 0 4.576-3h.846a5.003
                            5.003 0 0 0 4.576 3A5.006 5.006 0 0 0 22 14.999V14c0-.098-.015-.194-.042-.287l-2.511-8.368zM7.001 18A3.005
                            3.005 0 0 1 4 15c0-.076.017-.147.022-.222A2.995 2.995 0 0 1 7 12a3 3 0 0 1 3 3v.009A3.004 3.004 0 0 1 7.001
                            18zm9.998 0A3.004 3.004 0 0 1 14 15.009V15a3 3 0 0 1 6-.001A3.005 3.005 0 0 1 16.999 18z"/></svg>
                        )
                      } else {
                        return (
                          <svg id={`seenicon${i.episode_number}`} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8`} viewBox="0 0 20 20" fill="#00BF60">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )
                      }
                    } ()
                  }
              </button>
            </div>
            <h4 className="mt-2 font-semibold">{i.name}</h4>
          </div>
        </div>
      );

      // Push it to the episodes array
      episodes.push(curr);
    }

    // Maps each episode JSX into a resulting div
    let res = (
      <div className="py-8">
        <div className="relative justify-center items-center">
          <div id='episodes' className="flex flex-row card-Container px-8 space-x-8">
            {
              episodes.map((element) => (
                element
              ))
            }
          </div>

          <div className='absolute top-[30%] left-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
            shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollLeft('episodes')}>
            <a className='text-2xl font-semibold text-white select-none'>&#10094;</a>
          </div>
          <div className='absolute top-[30%] right-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
            shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollRight('episodes')}>
            <a className='text-2xl font-semibold text-white select-none'>&#10095;</a>
          </div>
        </div>

        <div className='grow flex items-end justify-center mt-10'>
          <div className='grow bg-[#E0E0E0] h-6 rounded-full mx-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.3)]'>
            <div className='w-1/3 h-full bg-gradient-to-r from-[#DE15FF] to-[#FF971D] rounded-l-full' />
          </div>
        </div>
      </div>
    )

    // Renders the final div to the page
    var resultDiv = document.getElementById("info");
    var root = createRoot(resultDiv);
    root.render(res);
  }

  async function addToHistory(i) {    
    let button = document.getElementById(`seenbutton${i.episode_number}`);
    let icon = document.getElementById(`seenicon${i.episode_number}`);

    icon.classList.add(styles.fadeOut);

    let currRoot = createRoot(button);

    currRoot.render(<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-8 w-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>);
    button.disabled = true;

    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    let dateTime = new Date().toISOString();

    var body = {
      user: userInfo.res,
      id: showID,
      season: i.season_number,
      episode: i.episode_number,
      date: dateTime
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    await fetch('/api/user/history/add-episodehistory', options);
    button.disabled = false;

    currRoot.render(
      <svg id={`seenicon${i.episode_number}`} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#00BF60">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )

    let temp = info;
    temp.watched.push({ "season": i.season_number, "episode": i.episode_number })
    infoHandler(temp);
    console.log(info);
  }

  // Scroll left in the episodes list
  function handleScrollLeft(id) {
    let div = document.getElementById(id);
    let distance = screen.width * 2 / 3;
    div.scrollBy({
      left: -distance,
      behavior: 'smooth'
    });
  }

  // Scroll right in the episodes list
  function handleScrollRight(id) {
    let div = document.getElementById(id);
    let distance = screen.width * 2 / 3;
    div.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  function handleEpisodeClick(episode) {
    setEpisodeEnabled(true);
    setCurrEpisode(episode);
    let currRoot = createRoot(document.getElementById(`seenbutton${episode.episode_number}`));
    setCurrEpisodeRoot(currRoot);
  }

  function controlPopup(option) {
    setEpisodeEnabled(option);
  }

  return (
    <div>
      <div className="flex flex-row border-b-2 border-[#FF971D] px-8 space-x-0.5">
        {
          result.map((element) => (
            element
          ))
        }
      </div>

      <div id="info" className="bg-[rgba(255,151,29,0.2)] shadow-[4px_4px_20px_-5px_rgba(0,0,0,0.5)_inset]" />

      <EpisodePopup enabled={episodeEnabled} user={user} episode={currEpisode} episodeRoot={currEpisodeRoot} showID={showID} controlPopup={controlPopup} info={info} infoHandler={infoHandler} />

    </div>
  )
}