import Head from 'next/head'
import Layout from '../components/Layout'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Movies.module.css'
import { useEffect, useState, useRef } from 'react'
import useInterval from '../components/useInterval'

const fetcher = url => fetch(url).then(res => res.json())

export default function MoviesHome() {

  const { data, error } = useSWR('/api/trending-movies', fetcher)
  const [ slideIndex, setSlideIndex ] = useState(1);

  useEffect(() => {
    showSlides(slideIndex);
  })

  useInterval(() => {
    handleRightClick();
  }, 10000);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  function handleRightClick() {
    if (slideIndex + 1 > 10) {
      setSlideIndex(1);
    } else {
      setSlideIndex(slideIndex + 1);
    }
  }

  function handleLeftClick() {
    if (slideIndex - 1 < 1) {
      setSlideIndex(10);
    } else {
      setSlideIndex(slideIndex - 1);
    }
  }

  function showSlides(n) {
    let slides = document.getElementsByClassName(`${styles.mySlides}`);
    let dots = document.getElementsByClassName(`${styles.dot}`);
    let currSlide = document.getElementById(slideIndex - 1);

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(` ${styles.active}`, "");
    }
    if (slides[slideIndex-1]) {
      slides[slideIndex-1].style.display = "block";
    }
    if (dots[slideIndex-1]) {
      dots[slideIndex-1].className += ` ${styles.active}`;
    }

    if (data) {
      document.getElementById('title').innerHTML = data.popular[slideIndex - 1].movie.title;
      document.getElementById('description').innerHTML = data.popular[slideIndex - 1].movie.details.overview;
      document.getElementById('year').innerHTML = data.popular[slideIndex - 1].movie.year;

      let releaseDates = data.popular[slideIndex - 1].movie.details.release_dates;
      let rating;
      for (let i = 0; i < releaseDates.results.length; i++) {
        var curr = releaseDates.results[i];
        if (curr.iso_3166_1 == 'US') {
          for (let j = 0; j < curr.release_dates.length; j++) {
            var element = curr.release_dates[j];
            if (element.certification) {
              rating = element.certification;
              break;
            }
          }
        }
      }
      document.getElementById('rating').innerHTML = rating;

      let runtime = data.popular[slideIndex - 1].movie.details.runtime;
      document.getElementById('runtime').innerHTML = Math.floor(runtime / 60) + "h " + runtime % 60 + "m";


      let genres = data.popular[slideIndex - 1].movie.details.genres;
      let genreContainer = document.getElementById('keywords');
      genreContainer.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        if (i == genres.length) break;
        let element = genres[i];

        let temp = document.createElement('div');
        temp.classList.add('px-4', 'py-1', 'mr-2', 'mb-1', 'rounded-full', 'border-2', 'border-[#C3C3C3]', 'text-center',
          'flex-none', 'w-fit');

        let text = document.createElement('p');
        text.classList.add('2xl:text-base', 'xl:text-sm', 'lg:text-xs', 'sm:text-base', 'text-sm')
        text.innerHTML = element.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        temp.appendChild(text);
        genreContainer.appendChild(temp);
      }      

      document.getElementById('vote').innerHTML = data.popular[slideIndex - 1].movie.details.vote_average.toString().slice(0, 3) + "/10";
      document.getElementById('vote2').innerHTML = data.popular[slideIndex - 1].movie.details.vote_average.toString().slice(0, 3) + "/10";
    }
  }

  function handleScrollLeft(id) {
    let div = document.getElementById(id);
    let distance = screen.width * 2 / 3;
    div.scrollBy({
      left: -distance,
      behavior: 'smooth'
    });
  }

  function handleScrollRight(id) {
    let div = document.getElementById(id);
    let distance = screen.width * 2 / 3;
    div.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  console.log(data);

  return (
    <Layout>
      <div>
        <Head>
          <title>Ramedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='scroll-smooth'>
          <div className='flex justify-center lg:py-12 md:py-8 py-6'>
            <h1 className='2xl:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold tracking-wider'>Movies</h1>
          </div>

          <div className='lg:flex-row flex-col flex'>
            <div className='xl:w-3/4 lg:w-[70%] flex-none relative z-10'>
              {
                data.popular.map((element) => (
                  <div key={element.movie.title} id={data.popular.indexOf(element)} className={`${styles.mySlides} ${styles.fade}`}>
                    <Link href={`/movie/${element.movie.ids.imdb}`}>
                      <a>
                        <Image src={element.movie.imageurl} alt={element.movie.title} width={1493} height={839} priority layout='raw'
                          className='w-full lg:rounded-r-3xl lg:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.5)]
                                    shadow-[0px_4px_10px_0px_rgba(0,0,0,0.5)]' />
                      </a>
                    </Link>
                  </div>
                ))
              }

              <a className={styles.prev} onClick={handleLeftClick}>&#10094;</a>
              <a className={styles.next} onClick={handleRightClick}>&#10095;</a>

              <div className='absolute bottom-4 left-2/4'>
                <div className='relative -left-2/4 sm:space-x-5 sm:visible invisible'>
                  <span className={styles.dot} onClick={() => setSlideIndex(1)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(2)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(3)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(4)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(5)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(6)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(7)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(8)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(9)}></span>
                  <span className={styles.dot} onClick={() => setSlideIndex(10)}></span>
                </div>
              </div>
            </div>

            <div className='lg:max-h-full lg:h-auto sm:h-[30vh] h-[40vh] flex flex-col z-10 overflow-hidden'>
              <h1 id='title' className='2xl:text-3xl 2xl:max-h-20 xl:text-2xl xl:max-h-24 xl:px-4
                                        lg:text-xl lg:max-h-14 lg:px-2 lg:whitespace-normal md:text-3xl md:mt-6
                                        sm:text-2xl sm:px-2 sm:truncate sm:mt-4 text-xl mt-4
                                        text-center font-semibold tracking-wider' />
              
              <p id='description' className='2xl:text-lg 2xl:max-h-[35%] 2xl:mt-8 xl:mt-4 xl:max-h-[30%] xl:text-base xl:px-6
                                            lg:mt-4 lg:max-h-[25%] lg:text-sm md:px-4 md:mt-4
                                            sm:px-4 sm:mt-2 px-4 mt-2
                                            flex-initial w-full font-medium tracking-wide overflow-auto'></p>

              <div id='keywords' className='xl:mt-6 lg:mt-4 lg:ml-4 md:mt-6 md:ml-6 sm:mt-4 sm:ml-4 ml-2 mt-4 flex flex-wrap' />

              <div className='2xl:text-base xl:text-sm xl:mt-1 lg:text-xs md:mt-2 sm:mt-0 sm:mb-0 mt-2 mb-4 text-sm h-min flex flex-row items-center'>
                <p id='year' className='sm:ml-6 ml-4'></p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p id='rating'></p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p id='runtime'></p>

                <div className='grow lg:invisible lg:w-0' />
                <div className='lg:invisible lg:w-0 sm:mr-10 mr-5 flex space-x-2 items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="sm:h-10 h-8" viewBox="0 0 20 20" fill="#FF971D">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                      1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                      0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                      00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p id='vote2' className='md:text-2xl text-lg font-semibold tracking-wider'></p>
                </div>
              </div>

              <div className='2xl:text-2xl xl:text-xl xl:mt-2 lg:ml-4 lg:visible lg:h-auto h-0 invisible flex space-x-2 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="2xl:h-10 xl:h-8 lg:h-8 md:h-10" viewBox="0 0 20 20" fill="#FF971D">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                    1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                    0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                    00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p id='vote' className='font-semibold tracking-wider'></p>
              </div>
            </div>
          </div>

          <div className='xl:-translate-y-32 xl:pt-44 lg:-translate-y-20 lg:pt-28 pt-6 rounded-xl bg-[#FFE3CE]'>
            <h2 className='text-4xl font-semibold ml-10'>Trending Movies</h2>
            <div className='relative justify-center items-center'>

              <div id='trending' className='card-Container gap-6 px-12 pt-8 pb-4 mb-4'>
                {
                  data.trending.map((element) => (
                    <div key={element.movie.title} className='card w-[15vw]'>
                      <div className='transition hover:scale-105 cursor-pointer rounded-xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)]'>
                        <Link href={`/movie/${element.movie.ids.imdb}`}>
                          <a>
                            <Image src={element.movie.imageurl} alt={element.movie.title} width={300} height={450} priority layout='raw'
                              className='w-full rounded-xl' />
                          </a>
                        </Link>
                      </div>
                      <div className='flex h-20 justify-center items-center'>
                        <h1 className='text-lg font-semibold text-ellipsis'>{element.movie.title}</h1>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className='absolute top-[40%] left-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
                shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollLeft('trending')}>
                <a className='text-2xl font-semibold text-white select-none'>&#10094;</a>
              </div>
              <div className='absolute top-[40%] right-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
                shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollRight('trending')}>
                <a className='text-2xl font-semibold text-white select-none'>&#10095;</a>
              </div>
            </div>
          </div>

          <div className='-translate-y-32'>
            <h2 className='text-4xl font-semibold ml-10'>Anticipated Movies</h2>
            <div className='relative justify-center items-center'>

              <div id='anticipated' className='card-Container gap-6 px-12 pt-8 pb-4 mb-4'>
                {
                  data.anticipated.map((element) => (
                    <div key={element.movie.title} className='card w-[15vw]'>
                      <div className='transition hover:scale-105 cursor-pointer rounded-xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)]'>
                        <Link href={`/movie/${element.movie.ids.imdb}`}>
                          <a>
                            <Image src={element.movie.imageurl} alt={element.movie.title} width={300} height={450} priority layout='raw'
                              className='w-full rounded-xl' />
                          </a>
                        </Link>
                      </div>
                      <div className='flex h-20 justify-center items-center'>
                        <h1 className='text-lg font-semibold text-ellipsis'>{element.movie.title}</h1>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className='absolute top-[40%] left-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
                shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollLeft('anticipated')}>
                <a className='text-2xl font-semibold text-white select-none'>&#10094;</a>
              </div>
              <div className='absolute top-[40%] right-4 w-12 h-12 cursor-pointer bg-black flex justify-center items-center rounded-full
                shadow-[4px_4px_10px_0px_rgba(0,0,0,1)]' onClick={() => handleScrollRight('anticipated')}>
                <a className='text-2xl font-semibold text-white select-none'>&#10095;</a>
              </div>
            </div>
          </div>

          {/* <div className='flex justify-center mt-4'>
            <form action='/search' method='GET'
              className='h-16 w-2/4 bg-[#FF971D] opacity-80 rounded-full
                          flex items-center px-4
                          hover:opacity-100 focus-within:opacity-100
                          transition-all duration-200'>
              <button type="submit" value="Submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input type="text" id='search-text' name='keyword' placeholder="Search Movies"
                className='grow px-4 text-lg text-[#131313] font-sans font-medium placeholder:italic placeholder:text-[#131313] bg-[#FF971D] focus:outline-0'/>
            </form>
          </div> */}
        </main>
      </div>
    </Layout>
  )
}