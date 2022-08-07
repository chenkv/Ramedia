import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import Layout from "../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function Search() {
  const [ movieExpanded, setMovieExpanded ] = useState(false);
  const [ showExpanded, setShowExpanded ] = useState(false);
  const [ movieRoot, setMovieRoot ] = useState(null);
  const [ showRoot, setShowRoot ] = useState(null);
  const [ loadingRoot, setLoadingRoot ] = useState(null);
  const [ searchResult, setSearchResult ] = useState(null);
  const router = useRouter();
  const keyword = router.query.keyword;

  useEffect(() => {
    if (!movieRoot) {
      setMovieRoot(createRoot(document.getElementById("resMovie")));
    }
    if (!showRoot) {
      setShowRoot(createRoot(document.getElementById("resShow")));
    }
    if (!loadingRoot) {
      setLoadingRoot(createRoot(document.getElementById("loadingIcon")));
    }
  }, [])

  useEffect(() => {
    if (keyword) {
      data = {
        title: keyword,
        movie: document.getElementById("m").checked,
        show: document.getElementById("s").checked,
        game: document.getElementById("g").checked,
        page_number: 0
      }
      updateData();
    }
  }, [keyword]);

  useEffect(() => {
    if (searchResult) {
      renderResults();
    }
  }, [searchResult, movieExpanded, showExpanded])

  var data;
  let movieHTML;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (keyword == event.target.keyword.value) return;

    movieRoot.render();
    showRoot.render();
    loadingRoot.render(
      <div className="w-full h-[70vh] flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-20 w-20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
      </div>
      
    );

    router.push('?keyword=' + event.target.keyword.value);
  }

  async function updateData() {
    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/search';
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSONdata,
    }

    var response = await fetch(endpoint, options);
    response = await response.json();

    if (response.status == 500) {
      alert("ERROR!");
      return;
    }

    setMovieExpanded(false);
    setShowExpanded(false);
    
    setSearchResult(response);
  }

  function renderResults() {
    if (searchResult.movieRes && searchResult.movieRes.results.length > 0) {
      movieHTML = (
        <div className="">
          <div className="flex items-end">
            <h1 className="ml-6 text-4xl font-bold">Movies</h1>
            <div className="grow" />
            {
              function () {
                if (searchResult.movieRes.results.length > 6) {
                  if (!movieExpanded) {
                    return (
                      <a className="mr-4 text-gray-400 tracking-wider cursor-pointer" onClick={() => {setMovieExpanded(!movieExpanded)}}>
                        <p>Expand <b>&#8594;</b></p>
                      </a>
                    );
                  } else {
                    return (
                      <a className="mr-4 text-gray-400 tracking-wider cursor-pointer" onClick={() => {setMovieExpanded(!movieExpanded)}}>
                        <p>Contract <b>&#8592;</b></p>
                      </a>
                    );
                  }
                }
              } ()
            }
          </div>
          <div className="my-2 border-b-2 border-[#FF971D]" />
          <div id="movieExp" className="mt-4 grid grid-cols-6 gap-4 px-4">
            {
              function () {
                if (!movieExpanded) {
                  let temp = [];

                  for (let i = 0; i < 6; i++) {
                    let curr = searchResult.movieRes.results[i];
                    
                    if (curr) {
                      temp.push(
                        <div key={curr.imdb_id} className='relative'>
                          <a href={"/movie/" + curr.imdb_id}>
                            <Image src={"https://image.tmdb.org/t/p/w300" + curr.poster_path} alt={curr.title} width={300} height={450} layout='raw' className="rounded-xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear" />
                          </a>
                          <h1 className='mt-2 text-center text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{curr.title}</h1>
                        </div>
                      );
                    }
                  }
  
                  return (
                    temp.map((element) => element)
                  );
                } else {
                  return (
                    searchResult.movieRes.results.map((element) => (
                      <div key={element.imdb_id} className='relative'>
                          <a href={"/movie/" + element.imdb_id}>
                            <Image src={"https://image.tmdb.org/t/p/w300" + element.poster_path} alt={element.title} width={300} height={450} layout='raw' className="rounded-xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear" />
                          </a>
                          <h1 className='mt-2 text-center text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{element.title}</h1>
                      </div>
                    ))
                  );
                }
              } ()
            }
          </div>
        </div>
      )
    } else {
      movieHTML = (
        <div></div>
      )
    }
    movieRoot.render(movieHTML);

    var showHTML;
    if (searchResult.showRes && searchResult.showRes.results.length > 0) {
      showHTML = (
        <div>
          <div className="flex items-end">
            <h1 className="ml-6 text-4xl font-bold">Shows</h1>
            <div className="grow" />
            {
              function () {
                if (searchResult.showRes.results.length > 6) {
                  if (!showExpanded) {
                    return (
                      <a className="mr-4 text-gray-400 tracking-wider cursor-pointer" onClick={() => {setShowExpanded(!showExpanded)}}>
                        <p>Expand <b>&#8594;</b></p>
                      </a>
                    );
                  } else {
                    return (
                      <a className="mr-4 text-gray-400 tracking-wider cursor-pointer" onClick={() => {setShowExpanded(!showExpanded)}}>
                        <p>Contract <b>&#8592;</b></p>
                      </a>
                    );
                  }
                }
              } ()
            }
          </div>
          <div className="my-2 border-b-2 border-[#FF971D]" />
          <div className="mt-4 grid grid-cols-6 gap-4 px-4">
            {
              function () {
                if (!showExpanded) {
                  let temp = [];

                  for (let i = 0; i < 6; i++) {
                    let curr = searchResult.showRes.results[i];
                    
                    if (curr) {
                      temp.push((
                        <div key={curr.imdb_id} className='relative'>
                          <a href={"/series/" + curr.imdb_id}>
                            <Image src={"https://image.tmdb.org/t/p/w300" + curr.poster_path} alt={curr.title} width={300} height={450} layout='raw' className="rounded-xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear" />
                          </a>
                          <h1 className='mt-2 text-center text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{curr.title}</h1>
                        </div>
                      ));
                    }
                  }
  
                  return (
                    temp.map((element) => element)
                  );
                } else {
                  return (
                    searchResult.showRes.results.map((element) => (
                      <div key={element.imdb_id} className='relative'>
                        <a href={"/series/" + element.imdb_id}>
                          <Image src={"https://image.tmdb.org/t/p/w300" + element.poster_path} alt={element.name} width={300} height={450} layout='raw' className="rounded-xl hover:ring-[5px] ring-[#FF971D] transition-all duration-200 ease-linear" />
                        </a>
                        <h1 className='mt-2 text-center text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{element.name}</h1>
                      </div>
                    ))
                  );
                }
              } ()
            }
          </div>
            
        </div>
      )
    } else {
      showHTML = (
        <div></div>
      )
    }
    showRoot.render(showHTML);

    loadingRoot.render();
  }

  return (
    <Layout>
      <div>
        <Head>
            <title>Mimir</title>
        </Head>
        <main className="flex flex-col">
          <div className="flex flex-row justify-center items-center mt-4">
            <h1 className="text-6xl">Search</h1>
          </div>

          <form className='w-full flex flex-row justify-center items-center px-2 py-2 transition-all duration-200 space-x-6'
            onSubmit={handleSubmit}>

            <div className="w-2/4 flex items-center border-b-[6px] border-[#FF971D]">
              <button type="submit" value="Submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input type="text" id='keyword' name='keyword' placeholder="Search"
                className='grow h-10 px-4 text-3xl text-[#131313] font-sans font-medium placeholder:italic
                        placeholder:opacity-80 placeholder:text-[#131313] bg-[#F9F6F7] focus:outline-0 transition-all duration-300 ease-linear'/>
            </div>

            <div className="flex flex-col">
              <div className="space-x-2 flex items-center">
                <input type="checkbox" id="m" className="form-check-input appearance-none h-4 w-4
                                                        border border-gray-300 rounded-sm bg-white 
                                                        checked:bg-blue-600 checked:border-blue-600 
                                                        focus:outline-none transition duration-200 bg-no-repeat 
                                                        bg-center bg-contain cursor-pointer"/>
                <label htmlFor="m">Movie</label>
              </div>
              <div className="space-x-2 flex items-center">
                <input type="checkbox" id="s" className="form-check-input appearance-none h-4 w-4
                                                        border border-gray-300 rounded-sm bg-white 
                                                        checked:bg-blue-600 checked:border-blue-600 
                                                        focus:outline-none transition duration-200 bg-no-repeat 
                                                        bg-center bg-contain cursor-pointer"/>
                <label htmlFor="s">TV Show</label>                                
              </div>
              <div className="space-x-2 flex items-center">
                <input type="checkbox" id="g" className="form-check-input appearance-none h-4 w-4
                                                        border border-gray-300 rounded-sm bg-white 
                                                        checked:bg-blue-600 checked:border-blue-600 
                                                        focus:outline-none transition duration-200 bg-no-repeat 
                                                        bg-center bg-contain cursor-pointer"/>
                <label htmlFor="g">Video Game</label>
              </div>
            </div>

          </form>

          <div className='min-h-screen mt-2 mx-2'>
            <div id="resMovie" />
            <div id="resShow" />
            <div id="resGame" />
            <div id="loadingIcon" />
          </div>
        </main>
      </div>
    </Layout>
  )
}