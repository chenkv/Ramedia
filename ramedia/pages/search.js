import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import Layout from "../components/Layout";

export default function Search() {
    const [ pageNum, setPageNum ] = useState(0);
    const router = useRouter();

    const handleSubmit = async (event) => {

        event.preventDefault();

        router.push('?keyword=' + event.target.keyword.value);

        const data = {
            title: event.target.keyword.value,
            movie: event.target.m.checked,
            show: event.target.s.checked,
            game: event.target.g.checked,
            page_number: pageNum
        }

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
        var response = await response.json();

        if (response.status == 500) {
            alert("ERROR!");
            return;
        }

        console.log(response);

        var movieHTML = (
            <div className="card-Container">
                {
                    response.movieRes.results.map((element) => (
                        <div key={element.id} className='card'>
                            <button type="button" onClick={() => router.push(`/movie/${element.imdb_id}`)}>
                                <img src={"https://image.tmdb.org/t/p/w300" + element.poster_path} className='w-full rounded-xl mb-1' />
                                <h1 className='text-lg font-semibold px-2 h-14 overflow-hidden text-ellipsis text-[#303841]'>{element.title}</h1>
                            </button>
                        </div>
                    ))
                }
            </div>
        )

        var resultDiv = document.getElementById("results");
        var root = createRoot(resultDiv);

        root.render(movieHTML);
    }

    return (
        <Layout>
            <div>
                <Head>
                    <title>Ramedia</title>
                </Head>
                <main className="flex flex-col">
                    <div className="flex w-screen py-8 px-8 items-center">
                        <form className='grow flex flex-row items-center px-2 py-2 transition-all duration-200 space-x-6'
                            onSubmit={handleSubmit}>

                            <div className="border-b-[6px] border-[#FF971D]">
                                <button type="submit" value="Submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <input type="text" id='keyword' name='keyword' placeholder="Search"
                                    className='grow h-10 px-4 text-3xl text-[#131313] font-sans font-medium placeholder:italic
                                            placeholder:opacity-80 placeholder:text-[#131313] bg-[#F9F6F7] focus:outline-0'/>
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
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        <h1 className="text-6xl">Search</h1>
                    </div>

                    <div className="bg-orange-400">
                        <form className="text-center h-10">
                            Filters
                        </form>
                    </div>

                    <div className='' id="results">
                        
                    </div>
                </main>
            </div>
        </Layout>
    )
}