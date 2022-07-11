import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardOption({ page, user }) {
  const [ watchlist, setWatchlist ] = useState(null);

  useEffect(() => {
    async function getData() {
      if (!user.isLoading) {
        if (page == "Watchlist") {
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

        if (page == "Favorites") {

        }
      }
    }

    getData();
  }, [page])

  if (page == "Watchlist") {
    let watchlistHTML, tvlistHTML;
    if (watchlist) {
      let result = [];
      for (let i = 0; i < 6; i++) {
        const element = watchlist.movieres[i];

        result.push(
          <div className='relative w-[15vw]'>
            <Link href={"/movie/" + element.id}>
              <a>
                <Image src={"https://image.tmdb.org/t/p/w500" + element.details.poster_path} alt={element.details.title} width={500} height={750} layout='raw'
                  className='rounded-3xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear' />
              </a>
            </Link>
          </div>
        )
      }

      watchlistHTML = (
        <div className='grid gap-4 grid-cols-6'>
          {
            result.map((element) => element)
          }
        </div>
      )

      tvlistHTML = (
        <div className='grid gap-4 grid-cols-6'>
          {
            watchlist.showres.map((element) => (
              <div key={element.details.name} className='relative w-[15vw]'>
                <Link href={"/series/" + element.id}>
                  <a>
                    <Image src={"https://image.tmdb.org/t/p/w500" + element.details.poster_path} alt={element.details.name} width={300} height={450} layout='raw'
                      className='rounded-3xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear' />
                  </a>
                </Link>
              </div>
            ))
          }
        </div>
      )
    }

    return (
      <div className='mx-4 w-full'>
        <div className='text-center'>
          <h1 className='text-3xl py-4'><b className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D]">Movies</b> on your watchlist</h1>
          { watchlistHTML }
        </div>

        <div className='text-center mt-4'>
          <h1 className='text-3xl py-4'><b className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D]">TV Shows</b> tracked</h1>
          { tvlistHTML }
        </div>
      </div>
    )
  }

  if (page == "Favorites") {
    return (
      <div>Favorites!</div>
    )
  }

  return (
    <div></div>
  )
}