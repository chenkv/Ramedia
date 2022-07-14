import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Watchlist({ watchlist }) {
  const [ movieExpanded, setMovieExpanded ] = useState(false);
  const [ showExpanded, setShowExpanded ] = useState(false);

  let movielistHTML, tvlistHTML;
  if (watchlist) {

    console.log(watchlist);
    let movieResult = [], showResult = [];
    let movieOverflow = (watchlist.movieres.length > 6 ? true : false);
    let showOverflow = (watchlist.showres.length > 6 ? true : false);

    if (!movieExpanded) {
      for (let i = 0; i < 6; i++) {
        const element = watchlist.movieres[i];

        if (element) {
          movieResult.push(
            <div key={element.id} className='relative w-[15vw]'>
              <Link href={"/movie/" + element.id}>
                <a>
                  <Image src={"https://image.tmdb.org/t/p/w500" + element.details.poster_path} alt={element.details.title} width={500} height={750} layout='raw'
                    className='rounded-3xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear' />
                </a>
              </Link>
            </div>
          )
        }
      }

      movielistHTML = (
        <div>
          {
            function () {
              if (movieOverflow) {
                return (
                  <div className="flex justify-end mb-2 mr-4">
                    <a className="text-gray-400 tracking-wider cursor-pointer" onClick={() => {setMovieExpanded(!movieExpanded)}}>Expand <b>&#8594;</b></a>
                  </div>
                )
              } else {
                return (
                  <div className="my-4" />
                )
              }
            } ()
          }
          <div className='grid gap-4 grid-cols-6'>
            {
              movieResult.map((element) => element)
            }
          </div>
        </div>
      )
    } else {
      movielistHTML = (
        <div>
          {
            function () {
              if (movieOverflow) {
                return (
                  <div className="flex justify-end mb-2 mr-4">
                    <a className="text-gray-400 tracking-wider cursor-pointer" onClick={() => {setMovieExpanded(!movieExpanded)}}>Contract <b>&#8592;</b></a>
                  </div>
                )
              } else {
                return (
                  <div className="my-4" />
                )
              }
            } ()
          }
          <div className='grid gap-4 grid-cols-6'>
            {
              watchlist.movieres.map((element) => (
                <div key={element.id} className='relative w-[15vw]'>
                  <Link href={"/movie/" + element.id}>
                    <a>
                      <Image src={"https://image.tmdb.org/t/p/w500" + element.details.poster_path} alt={element.details.title} width={500} height={750} layout='raw'
                        className='rounded-3xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear' />
                    </a>
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
      )
    }

    if (!showExpanded) {
      for (let i = 0; i < 6; i++) {
        const element = watchlist.showres[i];

        if (element) {
          showResult.push(
            <div key={element.details.name} className='relative w-[15vw]'>
              <Link href={"/series/" + element.id}>
                <a>
                  <Image src={"https://image.tmdb.org/t/p/w500" + element.details.poster_path} alt={element.details.name} width={300} height={450} layout='raw'
                    className='rounded-3xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear' />
                </a>
              </Link>
            </div>
          )
        }
      }

      tvlistHTML = (
        <div>
          {
            function () {
              if (showOverflow) {
                return (
                  <div className="flex justify-end mb-2 mr-4">
                    <a className="text-gray-400 tracking-wider cursor-pointer" onClick={() => {setShowExpanded(!showExpanded)}}>Expand <b>&#8594;</b></a>
                  </div>
                )
              } else {
                return (
                  <div className="my-4" />
                )
              }
            } ()
          }
          <div className='grid gap-4 grid-cols-6'>
            {
              showResult.map((element) => element)
            }
          </div>
        </div>
      )
    } else {
      tvlistHTML = (
        <div>
          {
            function () {
              if (showOverflow) {
                return (
                  <div className="flex justify-end mb-2 mr-4">
                    <a className="text-gray-400 tracking-wider cursor-pointer" onClick={() => {setShowExpanded(!showExpanded)}}>Contract <b>&#8592;</b></a>
                  </div>
                )
              } else {
                return (
                  <div className="my-4" />
                )
              }
            } ()
          }
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
        </div>
      )
    }
  }

  return (
    <div className='mx-4 w-full'>
      <div className='text-center'>
        <h1 className='text-3xl pt-4'><b className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D]">Movies</b> on your watchlist</h1>
        { movielistHTML }
      </div>

      <div className='text-center mt-4'>
        <h1 className='text-3xl pt-4'><b className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D]">TV Shows</b> tracked</h1>
        { tvlistHTML }
      </div>
    </div>
  )
}