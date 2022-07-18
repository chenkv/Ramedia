import Image from "next/image";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import styles from '../styles/MovieOptions.module.css';

export default function EpisodePopup({ enabled, user, episode, episodeRoot, showID, controlPopup, info, infoHandler }) {
  const [ episodeSeenRoot, setEpisodeSeenRoot ] = useState(null);

  useEffect(() => {
    if (enabled) {
      setEpisodeSeenRoot(createRoot(document.getElementById("seenbutton")));
    }
  }, [episode])

  if (!episode || !enabled) {
    return;
  }

  document.addEventListener('scroll', function(e) {
    if (enabled) {
      let popupdiv = document.getElementById("popup");
      if (popupdiv) {
        popupdiv.style.top = window.scrollY + 'px';
      }
    }
  });

  async function addToHistory() {    
    let button = document.getElementById("seenbutton");
    let icon = document.getElementById("seenicon");

    icon.classList.add(styles.fadeOut);

    episodeSeenRoot.render(<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-12 w-12" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>);
    button.disabled = true;

    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    let dateTime = new Date().toISOString();

    var body = {
      user: userInfo.res,
      show_id: showID,
      episode_id: episode.id,
      season: episode.season_number,
      episode: episode.episode_number,
      date: dateTime
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    await fetch('/api/user/history?type=episode', options);
    button.disabled = false;

    episodeSeenRoot.render(
      <svg id="seenicon" xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#00BF60">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
    episodeRoot.render(
      <svg id={`seenicon${episode.episode_number}`} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${styles.fadeIn}`} viewBox="0 0 20 20" fill="#00BF60">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )

    let temp = info;
    temp.watched.push({ "season": episode.season_number, "episode": episode.episode_number })
    infoHandler(temp);
  }

  return (
    <div id="popup"
      className='absolute w-full h-full left-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center'
      onClick={e => {controlPopup(false)}}>

      <div className="relative w-5/6 h-5/6 bg-[#F9F6F7] rounded-3xl overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="absolute right-2 top-2 z-50 cursor-pointer" onClick={() => controlPopup(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>

        <div className='flex flex-col w-full h-full items-center'>
          <div className="relative w-3/4 h-3/4 flex-none">
            <Image
              src={"https://image.tmdb.org/t/p/original" + episode.still_path}
              alt={episode.name}
              layout='fill'
              objectFit='cover'
              quality={100}
              className='rounded-lg' />
          </div>

          <div className="flex flex-col flex-none w-full mt-4 space-y-4 px-4 selection:bg-[#FF971D] selection:text-white">
            <div className="text-center">
              <h1 className="text-3xl">{episode.name}</h1>
            </div>

            <p>{episode.overview}</p>

            <div className="flex items-center">
              <div>
                <p><b className="font-semibold">Air date</b>: {episode.air_date}</p>
                <p><b className="font-semibold">Runtime</b>: {episode.runtime}m</p>
              </div>
              <div className="grow" />
              <div className='flex space-x-2 items-center mr-[10%]'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="#FF971D">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                    1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                    0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                    00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className='text-2xl font-semibold tracking-wider'>{episode.vote_average.toFixed(1)}/10</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center w-3/12'>
            <button id="seenbutton" className='bg-[#FFE8D6] p-2 rounded-full cursor-pointer' onClick={e => addToHistory()}>
              {
                function () {
                  let isWatched = false;

                  for (let i = 0; i < info.watched.length; i++) {
                    const element = info.watched[i];
                    
                    if ((element.season == episode.season_number) && (element.episode == episode.episode_number)) {
                      isWatched = true;
                      break;
                    }
                  }

                  if (!info || !isWatched) {
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

          <div className='flex flex-none w-full mt-8 pb-4'>
            <div className='flex-none'>
              <div className='w-48 px-6 py-2 ml-4 mt-8 border-r-2 border-black'>
                <h2 className='text-3xl font-semibold tracking-wider'>Director</h2>
              </div>
            </div>

            <div className='grow grid grid-cols-3 gap-y-8 px-10'>
              {
                episode.crew.map((element) => {
                  if (element.job == "Director") {
                    return (
                      <div key={element.name} className='flex justify-start items-center pr-4'>
                        <div className='relative w-28 h-28 flex-none'>
                          <Image
                            src={"https://image.tmdb.org/t/p/w200" + element.profile_path}
                            alt={element.name}
                            layout='fill'
                            objectFit='cover'
                            quality={100}
                            className='rounded-full' />
                        </div>
                        <div className='ml-4'>
                          <h3 className='text-lg font-semibold'>{ element.name }</h3>
                          <h3 className='font-semibold text-[#8d8d8d]'>{ element.character }</h3>
                        </div>
                      </div>
                    )
                  }
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}