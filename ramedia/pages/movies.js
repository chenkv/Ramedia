import Head from 'next/head'
import Layout from '../components/Layout'
import useSWR from 'swr'
import Image from 'next/image';

const id = 'a06f9c2d9393e89eb2c7a4c7dc3a581d30fd78ce9f73904c232e5bf6b114feac';
const tmdbKey = 'd3f71a44bd873185b851afe9c5d14849';

// const fetcher = async url => {
//   const res = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'trakt-api-version': '2',
//       'trakt-api-key': id
//     }
//   })
  
//   return res.json();
// }

function MoviesHome({ data }) {

  // const { data, error } = useSWR('https://api.trakt.tv/movies/trending', fetcher)

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  console.log(data)

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className='h-[50vh] bg-neutral-500 text-center'>
            Trending Movie Carousel
          </div>
          <div>
            <form className='h-16 w-2/5 bg-slate-200 opacity-75 rounded-full absolute left-[30%] translate-y-[-2rem]
                            flex items-center px-4
                            hover:bg-slate-200 hover:opacity-100 focus:bg-slate-200 focus:opacity-100 
                            transition-all duration-200'>
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input type="text" placeholder="Search"
                className='grow px-4 text-lg font-sans font-medium placeholder:italic bg-slate-200 focus:outline-0'/>
            </form>
          </div>
          <div className='h-12 w-screen bg-teal-400 flex flex-row justify-center mt-8'>
            Movie Categories
          </div>
          <div className='card-Container pt-8 mb-4'>
            {
              data.map((element) => (
                <div className='card'>
                  <img src={element.movie.imageurl} className='w-full rounded-t-xl' />
                  {element.movie.title}
                </div>
              ))
            }
          </div>
        </main>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {

  const url = 'https://api.trakt.tv/movies/trending';

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': id
    }
  })
  
  const data = await res.json();

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    var currId = element.movie.ids.tmdb;
    var currURL = `https://api.themoviedb.org/3/movie/${currId}?api_key=${tmdbKey}&language=en-US`;
    var imageResponse = await fetch(currURL, { method: 'GET' }).catch(err => {
      element.movie.error = err;
    })
    var response = await imageResponse.json();
    element.movie.imageurl = "https://image.tmdb.org/t/p/original" + response.poster_path;
  }

  // Pass data to the page via props
  return { props: { data } }
}

export default MoviesHome