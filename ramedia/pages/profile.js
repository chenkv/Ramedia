import { useUser } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import Layout from '../components/Layout'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Trakt_Button from '../components/profile/Trakt_Button';
import { useEffect } from 'react';
import { useState } from 'react';

function profile() {
  const user = useUser();
  if (user.isLoading) {
    return (
      <h1>Loading!</h1>
    )
  }
  if (!user.user) {
    window.location.href = '/';
  }

  const router = useRouter();
  const code = router.query.code;
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (code) {
      getToken();
    }
    setLoading(false)
  }, [])

  async function getToken() {
    let codeData = { user_code: code }
    let response = await fetch('/api/trakt/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(codeData)
    });
    response = await response.json();

    if (response.response.access_token) {
      var storeData = { user: user.user, token: response }
      let response2 = await fetch('/api/trakt/store-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeData)
      });
      if (response2.status == 200) {
        console.log("success")
        router.reload(window.location.pathname)
      }
    }
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='flex flex-col items-center'>
          <div className='flex flex-row justify-center space-x-4'>
            <div className='w-32 h-32 relative'>
              <Image
                src={user.user.picture}
                alt={user.user.name}
                layout='fill'
                quality={100}
                priority
                className='w-32 h-32 rounded-full'
              />
            </div>
            <div className='flex items-center'>
              <h1 className='text-3xl'>{user.user.nickname}</h1>
            </div>
          </div>

          <Trakt_Button />

        </main>
      </div>
    </Layout>
  )
}

export default profile;
