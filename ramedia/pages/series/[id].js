import { useUser } from '@auth0/nextjs-auth0';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import SeriesOptions from '../../components/series/SeriesOptions';
import { useEffect, useState } from 'react';
import Seasons from '../../components/series/Seasons';

const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export default function SeriesPage() {
  const user = useUser();
  const router = useRouter();
  const data = useSWR(`/api/series/${router.query.id}`, fetcher)
  const [ info, setInfo ] = useState(data);
  const [ progress, setProgress ] = useState(0);

  useEffect(() => {
    async function getUserInfo() {
      if (!user.isLoading && router.query.id) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        var body = {
          user: userInfo.res,
          imdb_id: router.query.id,
        }
    
        const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        };
    
        let res = await fetch(`/api/user/get-seriesinfo`, options);
        res = await res.json();
        setInfo(res);
      }
    }

    getUserInfo();
  }, [user.isLoading, user.user, router.query.id])

  useEffect(() => updateProgressBar(), [data.data, info.watched]);

  if (data.error) {
    console.log(data.error.info);
    return <div>Error status {data.error.status}</div>
  }

  if (user.error) {
    console.log(user.error);
    return <div>Error with the user</div>
  }

  if (!data.data || user.isLoading) return <div>Loading...</div>

  console.log(data.data)

  var background;
  if (data.data.artRes.status != "error") {
    var backgroundURL;

    if (data.data.artRes.showbackground) {
      backgroundURL = data.data.artRes.showbackground[0].url;
      background = (
        <Image
          src={backgroundURL}
          alt={data.data.result.name}
          layout='fill'
          objectFit='cover'
          quality={100}
          priority
        />
      );
    } else if (data.data.artRes.hdshowlogo) {
      backgroundURL = data.data.artRes.hdshowlogo[0].url;
      background = (
        <Image
          src={backgroundURL}
          alt={data.data.result.name}
          layout='fill'
          quality={100}
          priority
        />
      );
    } else if (data.data.artRes.hdtvlogo) {
      backgroundURL = data.data.artRes.hdtvlogo[0].url;
      background = (
        <Image
          src={backgroundURL}
          alt={data.data.result.name}
          layout='fill'
          quality={100}
          priority
        />
      );
    }
  } else {
    background = (
      <div className='w-[1493px] h-[839px] flex justify-center items-center'>
        <h1 className='text-4xl'>Image not available!</h1>
      </div>
    );
  }

  let genreHTML;
  let rating;
  let cast = [];
  if (data.data) {  
    const genres = data.data.genreRes.genres;
    let currGenres = data.data.result.genre_ids;
    let result = [];

    for (let i of currGenres) {
      for (let j of genres) {
        if (j.id == i) {
          result.push(j.name);
        }
      }
    }

    genreHTML = (
      <div className='flex flex-wrap ml-4 mt-4'>
        {
          result.map((element) => (
            <div key={element} className='px-4 py-1 mr-2 mb-1 rounded-full border-2 border-[#C3C3C3] text-center flex-none w-fit'>
              <p className='font-semibold'>{element}</p>
            </div>
          ))
        }
      </div>
    );

    for (let i = 0; i < data.data.yearRes.content_ratings.results.length; i++) {
      var curr = data.data.yearRes.content_ratings.results[i];
      if (curr.iso_3166_1 == 'US') {
        rating = curr.rating;
      }
    }

    for (let i = 0; i < 6; i++) {
      if (data.data.creditsRes.cast[i]) {
        cast.push(data.data.creditsRes.cast[i]);
      }
    }
  }

  // Update the progress bar
  function updateProgressBar() {
    if (info.watched && data.data) {
      const set = new Set();
      let total = data.data.yearRes.number_of_episodes;
  
      for (let i of info.watched) {
        set.add(`${i.season},${i.episode}`);
      }
  
      let curr = document.getElementById("progressbar");
      curr.setAttribute("style", "width:" + ((set.size * 100) / total) + "%");
  
      if (set.size == total) {
        curr.classList.add("rounded-r-full");
      }
    }
  }

  const updateInfo = (newInfo) => {
    updateProgressBar();
    setInfo(newInfo);
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
            <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className='overflow-x-hidden'>
          <div className='bg-yellow-300 z-0 relative w-screen h-[80vh]'>
            { background }
            <div className='absolute bottom-0 left-0 w-screen h-32 bg-gradient-to-t from-[#F9F6F7] z-50' />
          </div>

          <div className='flex space-x-4 z-10 mt-8 mb-6 px-10'>
            <div className='flex-none flex flex-col justify-center'>
              <div className='shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)] rounded-3xl'>
                <Image src={"https://image.tmdb.org/t/p/w300" + data.data.result.poster_path} alt={data.data.result.name} layout='raw' width={300} height={450} className="rounded-3xl" />
              </div>
              
              <div className='flex flex-row mt-2 items-center font-semibold'>
                <p className='ml-2'>{data.data.result.first_air_date.slice(0, 4)}</p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p>{ rating }</p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p>{data.data.yearRes.episode_run_time + "m"}</p>
              </div>
            </div>

            <div className='grow flex flex-col selection:bg-[#FF971D] selection:text-white'>
              <div className='text-center mb-8'>
                <h1 className='text-5xl py-2 font-semibold'>{data.data.result.name}</h1>
              </div>

              <div className='grow flex flex-col'>
                <div className='flex flex-col'>
                  <p className='px-4 text-xl'>
                    {data.data.result.overview}
                  </p>

                  { genreHTML }

                  <div className='ml-4 my-4 flex space-x-2 items-center justify-start'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="#FF971D">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                        1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                        0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                        00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p className='text-2xl font-semibold tracking-wider'>{data.data.result.vote_average.toFixed(1)}/10</p>
                  </div>
                </div>

                <SeriesOptions user={user} showID={router.query.id} showData={data.data.yearRes} info={info} handler={updateInfo}/>

                <div className='grow flex items-end justify-center mb-2'>
                  <div className='grow bg-[#E0E0E0] h-6 rounded-full ml-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.3)]'>
                    <div id='progressbar' className='w-0 h-full bg-gradient-to-r from-[#DE15FF] to-[#FF971D] rounded-l-full transition-all ease-out duration-300' />
                  </div>
                </div>
                
              </div>

            </div>
          </div>

          <Seasons user={user} showData={data.data.yearRes} showID={router.query.id} info={info} infoHandler={updateInfo} />

          <div className='mt-8 pb-4'>
            <div className='flex'>
              <div className='flex-none'>
                <div className='w-48 px-6 py-2 ml-4 mt-8 border-r-2 border-black'>
                  <h2 className='text-3xl font-semibold tracking-wider'>Director</h2>
                </div>
              </div>

              <div className='grow grid grid-cols-3 gap-y-8 px-10'>
                {
                  data.data.yearRes.created_by.map((element) => (
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
                  ))
                }
              </div>
            </div>

            <div className='flex mt-8'>
              <div className='flex-none'>
                <div className='w-48 px-6 py-2 ml-4 mt-8 border-r-2 border-black'>
                  <h2 className='text-3xl font-semibold tracking-wider'>Cast</h2>
                </div>
              </div>

              <div className='grow grid grid-cols-3 gap-y-8 px-10'>
                {
                  cast.map((element) => (
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
                  ))
                }
              </div>
            </div>
          </div>

        </main>
      </div>
    </Layout>
  )
}