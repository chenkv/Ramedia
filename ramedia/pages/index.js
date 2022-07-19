import Head from 'next/head'
import Layout from '../components/Layout'
import { useUser } from '@auth0/nextjs-auth0'
import { useState } from 'react';
import SideBar from '../components/dashboard/SideBar';
import DashboardOption from '../components/dashboard/DashboardOption';

export default function Home() {
  const user = useUser();
  const [ page, setPage ] = useState("Watchlist");

  if (user.isLoading) return <div>Loading...</div>
  if (user.error) return <div>Error!</div>
  if (!user.user) {
    window.location.href = '/landing';
  }

  const updateChoice = (option) => {
    setPage(option);
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>Mimir</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='flex'>
            
          <SideBar handler={updateChoice} />

          <DashboardOption page={page} user={user} />

        </main>
      </div>
    </Layout>
  )
}
