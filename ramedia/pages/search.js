import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Search() {
    const router = useRouter();

var test = (
    <div className="w-20 h-20 bg-green-300">

    </div>
)

    return (
        <Layout>
            <div>
                <Head>
                    <title>Ramedia</title>
                </Head>
                <main className="flex flex-col">
                    <div className="flex w-screen py-8 px-8 items-center">
                        <form className='grow flex flex-row items-center px-2 py-2 transition-all duration-200 space-x-6'
                            action='/search' method='GET'>

                            <div className="border-b-[6px] border-[#FF971D]">
                                <button type="submit" value="Submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <input type="text" id='search-text' name='keyword' placeholder="Search"
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
                                    <label for="m">Movie</label>
                                </div>
                                <div className="space-x-2 flex items-center">
                                    <input type="checkbox" id="s" className="form-check-input appearance-none h-4 w-4
                                                                            border border-gray-300 rounded-sm bg-white 
                                                                            checked:bg-blue-600 checked:border-blue-600 
                                                                            focus:outline-none transition duration-200 bg-no-repeat 
                                                                            bg-center bg-contain cursor-pointer"/>
                                    <label for="s">TV Show</label>                                
                                </div>
                                <div className="space-x-2 flex items-center">
                                    <input type="checkbox" id="g" className="form-check-input appearance-none h-4 w-4
                                                                            border border-gray-300 rounded-sm bg-white 
                                                                            checked:bg-blue-600 checked:border-blue-600 
                                                                            focus:outline-none transition duration-200 bg-no-repeat 
                                                                            bg-center bg-contain cursor-pointer"/>
                                    <label for="g">Video Game</label>
                                </div>
                            </div>

                        </form>
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        <h1 className="text-6xl">Search</h1>
                        <h1>{router.query.keyword}</h1>
                    </div>

                    <div className="bg-orange-400">
                        <form className="text-center h-10">
                            Filters
                        </form>
                    </div>

                    <div className="text-center">
                        Results
                    </div>
                </main>
            </div>
        </Layout>
    )
}