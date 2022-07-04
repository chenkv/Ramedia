import Head from 'next/head'
import Layout from '../components/Layout'
import { useUser } from '@auth0/nextjs-auth0'
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const user = useUser();
  const [ watchlist, setWatchlist ] = useState(null);
  const [ tvlist, setTvlist ] = useState(null);
  
  useEffect(() => {
    async function getData() {
      if (!user.isLoading) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        var body = {
          user: userInfo.res,
        }
    
        const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        };
    
        var response = await fetch('/api/user/get-watchlist', options);
        response = await response.json();
        setWatchlist(response);
      }
    }

    getData();
  }, [user.isLoading])

  if (user.isLoading) return <div>Loading...</div>
  if (user.error) return <div>Error!</div>
  if (!user.user) {
    window.location.href = '/landing';
  }

  let watchlistHTML;
  if (watchlist) {
    watchlistHTML = (
      <div className='flex flex-row'>
        {
          watchlist.result.map((element) => (
            <div className='relative w-[15vw]'>
              <Link href={"/movie/" + element.id}>
                <a>
                  <Image src={"https://image.tmdb.org/t/p/original" + element.details.poster_path} width={300} height={450} layout='raw'
                    className='rounded-3xl' />
                </a>
              </Link>
            </div>
          ))
        }
      </div>
    )
  }

  let tvlistHTML;
  if (tvlist) {
    tvlistHTML = (
      <div>

      </div>
    )
  }

  console.log(watchlist);

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div>
            <h1>Movies on your watchlist</h1>
            { watchlistHTML }
          </div>

          <div>
            <h1>TV Shows Tracked</h1>
            { tvlistHTML }
          </div>
        </main>
      </div>
    </Layout>
  )
}
