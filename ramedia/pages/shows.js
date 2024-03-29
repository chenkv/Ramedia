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

  const { data, error } = useSWR('/api/trending-shows', fetcher)
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
      document.getElementById('title').innerHTML = data.popular[slideIndex - 1].show.title;
      document.getElementById('description').innerHTML = data.popular[slideIndex - 1].show.details.overview;
      document.getElementById('year').innerHTML = data.popular[slideIndex - 1].show.year;

      let releaseDates = data.popular[slideIndex - 1].show.details.content_ratings;
      let rating;
      for (let i = 0; i < releaseDates.results.length; i++) {
        var curr = releaseDates.results[i];
        if (curr.iso_3166_1 == 'US') {
          rating = curr.rating;
        }
      }
      document.getElementById('rating').innerHTML = rating;

      let runtime = data.popular[slideIndex - 1].show.details.episode_run_time[0];
      document.getElementById('runtime').innerHTML = runtime + "m";


      let genres = data.popular[slideIndex - 1].show.details.genres;
      let genreContainer = document.getElementById('keywords');
      genreContainer.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        if (i == genres.length) break;
        let element = genres[i];

        let temp = document.createElement('div');
        temp.classList.add('px-4', 'py-1', 'mr-2', 'mb-1', 'rounded-full', 'border-2', 'border-[#C3C3C3]', 'text-center',
          'flex-none', 'w-fit');

        let text = document.createElement('p');
        text.innerHTML = element.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        temp.appendChild(text);
        genreContainer.appendChild(temp);
      }      

      document.getElementById('vote').innerHTML = data.popular[slideIndex - 1].show.details.vote_average.toFixed(1) + "/10";
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

  // console.log(data);

  return (
    <Layout>
      <div>
        <Head>
          <title>Mimir</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='overflow-x-hidden'>
        <div className='flex justify-center py-12'>
            <h1 className='text-5xl font-semibold tracking-wider'>TV Shows</h1>
          </div>

          <div className='flex flex-row'>
            <div className='w-3/4 relative z-30 rounded-r-3xl bg-[#F9F6F7]'>
              {
                data.popular.map((element) => (
                  <div key={element.show.title} id={data.popular.indexOf(element)} className={`${styles.mySlides} ${styles.fade}`}>
                    <Link href={`/series/${element.show.ids.imdb}`}>
                      <a>
                        <Image src={element.show.imageurl} alt={element.show.title} width={1493} height={839} priority layout='raw' loading='eager'
                          className='w-full rounded-r-3xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.5)]' />
                      </a>
                    </Link>
                  </div>
                ))
              }

              <a className={styles.prev} onClick={handleLeftClick}>&#10094;</a>
              <a className={styles.next} onClick={handleRightClick}>&#10095;</a>

              <div className='absolute bottom-4 left-2/4'>
                <div className='relative -left-2/4 space-x-5'>
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

            <div className='w-1/4 z-20 flex flex-col'>
              <h1 id='title' className='px-4 text-center text-3xl font-semibold tracking-wider' />
              <p id='description' className='px-6 mt-8 w-full font-medium tracking-wide max-h-[30%] overflow-auto'></p>

              <div id='keywords' className='flex flex-wrap ml-4 mt-4'>

              </div>

              <div className='flex flex-row mt-1 items-center'>
                <p id='year' className='ml-6'></p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p id='rating'></p>
                <p className='px-2 font-bold text-lg'>&#183;</p>
                <p id='runtime'></p>
              </div>

              <div className='flex space-x-2 items-center ml-4 mt-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="#FF971D">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                    1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                    0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0
                    00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p id='vote' className='text-2xl font-semibold tracking-wider'></p>
              </div>
            </div>
          </div>

          <div className='bg-[#FFE3CE] -translate-y-32 rounded-xl pt-44'>
            <h2 className='text-4xl font-semibold ml-10'>Trending Shows</h2>
            <div className='relative justify-center items-center'>

              <div id='trending' className='card-Container gap-6 px-12 pt-8 pb-4 mb-4'>
                {
                  data.trending.map((element) => (
                    <div key={element.show.title} className='card w-[15vw]'>
                      <div className='transition hover:scale-105 cursor-pointer rounded-xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)]'>
                        <Link href={`/series/${element.show.ids.imdb}`}>
                          <a>
                            <Image src={element.show.imageurl} alt={element.show.title} width={300} height={450} priority layout='raw'
                              className='w-full rounded-xl' />
                          </a>
                        </Link>
                      </div>
                      <div className='flex h-20 justify-center items-center'>
                        <h1 className='text-lg font-semibold text-ellipsis'>{element.show.title}</h1>
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
            <h2 className='text-4xl font-semibold ml-10'>Anticipated Shows</h2>
            <div className='relative justify-center items-center'>

              <div id='anticipated' className='card-Container gap-6 px-12 pt-8 pb-4 mb-4'>
                {
                  data.anticipated.map((element) => (
                    <div key={element.show.title} className='card w-[15vw]'>
                      <div className='transition hover:scale-105 cursor-pointer rounded-xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.75)]'>
                        <Link href={`/series/${element.show.ids.imdb}`}>
                          <a>
                            <Image src={element.show.imageurl} alt={element.show.title} width={300} height={450} priority layout='raw'
                              className='w-full rounded-xl' />
                          </a>
                        </Link>
                      </div>
                      <div className='flex h-20 justify-center items-center'>
                        <h1 className='text-lg font-semibold text-ellipsis'>{element.show.title}</h1>
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
        </main>
      </div>
    </Layout>
  )
}