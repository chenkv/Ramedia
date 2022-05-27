import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json())

export default function moviePage() {
  const router = useRouter();

  const { data, error } = useSWR(`/api/getMovieData?imdb_id=${router.query.id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
            <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className='bg-yellow-300 z-0 relative'>
            <img src={data.artRes.moviebackground[0].url} className='z-0' />
            <div className='absolute bottom-0 left-0 w-screen h-32 bg-gradient-to-t from-[#F9F6F7] z-50' />
          </div>

          <div className='flex z-10 mt-4'>
            <div className=' w-3/12 flex justify-center'>
              <img src={"https://image.tmdb.org/t/p/w300" + data.result.poster_path} className='rounded-lg' />
            </div>
            <div className='bg-green-300 grow'>
                  <h1>{data.result.title}</h1>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}