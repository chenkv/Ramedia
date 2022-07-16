import Image from "next/image";

export default function EpisodePopup({ user, episode, showID }) {
  if (!episode) {
    return;
  }

  console.log(episode);
  async function addToHistory() {
    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    var body = {
      user: userInfo.res,
      id: showID,
      season: episode.season_number,
      episode: episode.episode_number
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    await fetch('/api/user/add-episodehistory', options);
  }

  return (
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
        <div className='bg-[#FFE8D6] p-2 rounded-full cursor-pointer' onClick={e => addToHistory()}>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className='w-12 h-12'
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ff971d" d="M19.447 5.345A3.27
            3.27 0 0 0 16.29 3a3.293 3.293 0 0 0-3.277 3h-2.025a3.297 3.297 0 0 0-3.284-3a3.268 3.268 0 0 0-3.151
            2.345l-2.511 8.368A1.027 1.027 0 0 0 2 14v1a5.006 5.006 0 0 0 5.001 5a5.003 5.003 0 0 0 4.576-3h.846a5.003
            5.003 0 0 0 4.576 3A5.006 5.006 0 0 0 22 14.999V14c0-.098-.015-.194-.042-.287l-2.511-8.368zM7.001 18A3.005
            3.005 0 0 1 4 15c0-.076.017-.147.022-.222A2.995 2.995 0 0 1 7 12a3 3 0 0 1 3 3v.009A3.004 3.004 0 0 1 7.001
            18zm9.998 0A3.004 3.004 0 0 1 14 15.009V15a3 3 0 0 1 6-.001A3.005 3.005 0 0 1 16.999 18z"/></svg>
        </div>
        <h3 className='text-lg font-semibold'>Seen</h3>
      </div>

      <div className='flex flex-none w-full mt-4 pb-4'>
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
  );
}