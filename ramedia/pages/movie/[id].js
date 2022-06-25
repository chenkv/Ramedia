import { useUser } from '@auth0/nextjs-auth0'
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';

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

export default function MoviePage() {
  const user = useUser();
  const router = useRouter();
  const data = useSWR(`/api/movie-data?imdb_id=${router.query.id}`, fetcher)

  if (data.error) {
    console.log(data.error.info);
    return <div>Error status {data.error.status}</div>
  }

  if (user.error) {
    console.log(user.error);
    return <div>Error with the user</div>
  }

  if (!data.data || user.isLoading) return <div>Loading...</div>

  var background;
  if (data.data.artRes.status != "error") {
    var backgroundURL;

    if (data.data.artRes.moviebackground) {
      backgroundURL = data.data.artRes.moviebackground[0].url;
      background = (
        <Image
          src={backgroundURL}
          alt={data.data.result.title}
          layout='fill'
          objectFit='cover'
          quality={100}
          priority
        />
      );
    } else {
      backgroundURL = data.data.artRes.hdmovielogo[0].url;
      background = (
        <Image
          src={backgroundURL}
          alt={data.data.result.title}
          layout='fill'
          quality={100}
          priority
        />
      );
    }
  } else {
    background = (
      <div className='w-screen h-full flex justify-center items-center'>
        <h1 className='text-4xl'>Image not available!</h1>
      </div>
    );
  }

  var loggedIn;
  if (user.user) {
    loggedIn = (
      <div className='grow flex flex-row justify-center items-center'>
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

        <div className='flex flex-col justify-center items-center w-3/12'>
          <div className='bg-[#FFE8D6] p-2 rounded-full cursor-pointer' >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="#ff971d">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className='text-lg font-semibold'>Favorite</h3>
        </div>

        <div className='flex flex-col justify-center items-center w-3/12'>
          <div className='bg-[#FFE8D6] p-2 rounded-full cursor-pointer' >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="#ff971d">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
          <h3 className='text-lg font-semibold'>Watchlist</h3>
        </div>
      </div>
    )
  }

  async function addToHistory() {
    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    let dateTime = new Date().toISOString();

    var body = {
      user: userInfo.res,
      imdb_id: router.query.id,
      date: dateTime,
      movie: true
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    var response = await fetch('/api/trakt/add-history', options);
  }

  console.log(data.data)

  let genreHTML;
  let rating;
  let cast = [];
  let director;
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

    for (let i = 0; i < data.data.yearRes.release_dates.results.length; i++) {
      var curr = data.data.yearRes.release_dates.results[i];
      if (curr.iso_3166_1 == 'US') {
        for (let j = 0; j < curr.release_dates.length; j++) {
          var element = curr.release_dates[j];
          if (element.certification) {
            rating = element.certification;
            break;
          }
        }
      }
    }

    for (let i = 0; i < 6; i++) {
      cast.push(data.data.creditsRes.cast[i]);
    }

    director = data.data.creditsRes.crew.filter(({job})=> job ==='Director')[0];
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
            <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className='bg-gradient-to-br from-[#DE15FF] to-[#FF971D] z-0 relative w-screen h-[80vh]'>
            { background }
            <div className='absolute bottom-0 left-0 w-screen h-32 bg-gradient-to-t from-[#F9F6F7] z-50' />
          </div>

          <div className='flex space-x-4 z-10 mt-8 px-10'>
            <div className='flex-none flex flex-col justify-center'>
              <div className='shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)] rounded-3xl'>
                <Image src={"https://image.tmdb.org/t/p/w300" + data.data.result.poster_path} alt={data.data.result.title} layout='raw' width={300} height={450} className="rounded-3xl" />
              </div>
              
              <div className='flex flex-row mt-2 items-center font-semibold'>
                <p className='ml-2'>{data.data.result.release_date.slice(0, 4)}</p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p>{ rating }</p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p>{Math.floor(data.data.yearRes.runtime / 60) + "h " + data.data.yearRes.runtime % 60 + "m"}</p>
              </div>
            </div>

            <div className='grow flex flex-col'>
              <div className='grow'>
                <div className='text-center mb-8'>
                  <h1 className='text-5xl py-2 font-semibold'>{data.data.result.title}</h1>
                </div>

                <div className='flex flex-row'>
                  <div className='w-8/12'>
                    <p className='px-4 text-xl'>
                      {data.data.result.overview}
                    </p>

                    { genreHTML }
                  </div>
                  <div className='w-4/12 flex space-x-2 items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="#FF971D">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                        1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                        0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                        00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p className='text-2xl font-semibold tracking-wider'>{data.data.result.vote_average}/10</p>
                  </div>
                </div>
              </div>

              { loggedIn }

            </div>
          </div>

          <div className='mt-8'>
            <div className='flex'>
              <div className='flex-none'>
                <div className='w-48 px-6 py-2 ml-4 mt-8 border-r-2 border-black'>
                  <h2 className='text-3xl font-semibold tracking-wider'>Director</h2>
                </div>
              </div>

              <div className='grow grid grid-cols-3 gap-y-8 px-10'>
                <div className='flex justify-start items-center'>
                  <div className='relative w-28 h-28 flex-none'>
                    <Image
                      src={"https://image.tmdb.org/t/p/w200" + director.profile_path}
                      alt={director.name}
                      layout='fill'
                      objectFit='cover'
                      quality={100}
                      className='rounded-full' />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold'>{ director.name }</h3>
                  </div>
                </div>
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