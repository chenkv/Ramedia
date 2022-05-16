import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import useSWR from 'swr'

// const id = "sre0tw7zr2jw0o93np2tkhz1ctfx9x";
// const secret = "euqwqvhvecu2zf0wp8xq4rhrzt1o9b";

// const fetcher = (url) => {
//   fetch(`https://api.rawg.io/api/games?search=resident`, { method: 'GET' })
//   .then(res => {
//     console.log(res);
//       fetch("https://api.igdb.com/v4/games", {
//         mode: 'no-cors',
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Client-ID': id,
//           "Authorization": "Bearer " + res.access_token,
//         },
//         data: 'fields name; limit 10;',
//       })
//     }
//   )
// };

const id = 'a06f9c2d9393e89eb2c7a4c7dc3a581d30fd78ce9f73904c232e5bf6b114feac';

const fetcher = async url => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': id
    }
  })

  return res.json();
}

export default function GamesHome() {

  const { data, error } = useSWR('https://api.trakt.tv/movies/trending', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <Layout>
      <div>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className='h-12 w-screen bg-teal-400 flex flex-row justify-center'>
            Game Categories
          </div>
          <div className='h-96 bg-neutral-500 text-center'>
            Trending Games Carousel
          </div>
          <div className='h-16 w-2/5 bg-yellow-400 rounded-full absolute left-[30%] translate-y-[-2rem] text-center'>
            Search Bar
          </div>
          <div className='card-Container pt-10'>
            {
              data.map((element) => (
                <div className='card'>
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