import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import { useUser } from '@auth0/nextjs-auth0'

export default function Home() {
  const user = useUser();

  if (user.isLoading) return <div>Loading...</div>

  async function buttonPress() {
    console.log("YEP!");

    // var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    // userInfo = await userInfo.json();

    // let response = await fetch('/api/trakt/get-history', { 
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     user: userInfo.res
    //   })
    // })

    // response = await response.json();
    // console.log(response);
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>Mimir</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div onClick={() => buttonPress()} className='z-50 bg-red-500 p-10 rounded-full cursor-pointer'>Testing</div>

        {/* <main className='relative -z-50'>
          <h1 className={styles.title}>
            Mimir
          </h1>

          

          <div className='w-screen h-[60vh] bg-[#FF971D] skew-y-12 translate-y-20 -z-10 relative'>
          </div>

          <div className='w-screen h-[100vh] bg-[#FFFFFF] -skew-y-[8deg] -translate-y-[19vh] -z-20 relative'></div>

          <div className='w-[100vw] h-[100vw] rounded-full bg-transparent outline-[4rem] outline-[#FF971D] outline absolute z-10 -right-[10vw] top-[40vh]'></div>
          <div className='w-[100vw] h-[100vw] rounded-full bg-transparent outline-[4rem] outline-[#FFFFFF] outline absolute z-0 -right-[11vw] top-[40vh]'></div>

          <div className='w-screen h-screen bg-[#FF971D] -translate-y-[30vh] -z-30 relative'></div>
        </main> */}
      </div>
    </Layout>
  )
}
