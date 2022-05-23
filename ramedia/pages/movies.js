import Head from 'next/head'
import Layout from '../components/Layout'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json())

export default function MoviesHome() {

  const { data, error } = useSWR('/api/trendingMovies', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  console.log(data)

  return (
    <Layout>
      <div className='bg-[#F9F6F7]'>
        <Head>
          <title>Ramedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='overflow-x-hidden'>
          <div className='h-auto w-[70vw] left-[15vw] bg-neutral-500 relative flex gap-2 snap-x snap-mandatory overflow-x-auto z-0'>
            {
              data.data2.map((element) => (
                <div key={element.title} className='snap-center shrink-0 w-[70vw]'>
                  <img src={element.imageurl} className="w-[70vw]" />
                </div>
              ))
            }
          </div>

          <div className='flex justify-center mt-4'>
            <form className='h-16 w-2/4 bg-[#FF971D] opacity-75 rounded-full
                            flex items-center px-4
                            hover:opacity-100 focus-within:opacity-100
                            transition-all duration-200'>
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input type="text" placeholder="Search Movies"
                className='grow px-4 text-lg text-[#131313] font-sans font-medium placeholder:italic placeholder:text-[#131313] bg-[#FF971D] focus:outline-0'/>
            </form>
          </div>

          <div className='text-center mt-4'>
            <h2 className='text-4xl font-semibold text-[#303841]'>Trending Movies</h2>
            <div className='card-Container pt-8 mb-4'>
              {
                data.data.map((element) => (
                  <div key={element.movie.title} className='card'>
                    <img src={element.movie.imageurl} className='w-full rounded-xl mb-1' />
                    <h1 className='text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{element.movie.title}</h1>
                  </div>
                ))
              }
            </div>
          </div>

          <div className='h-12 w-screen bg-teal-400 flex flex-row justify-center'>
            Movie Categories
          </div>
        </main>
      </div>
    </Layout>
  )
}