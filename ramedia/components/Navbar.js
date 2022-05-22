import Link from "next/link";
import Image from "next/image";

export default function Navbar() {

    function handleClick() {
        console.log("Clicked!");
    }

    const links = [
        ['Home', '/', 1],
        ['Movies', '/movies', 2],
        ['Shows', '/shows', 3],
        ['Games', '/games', 4],
    ];

    return (
        <div className="fixed w-screen top-0 flex bg-zinc-200 z-50">
            <div className="flex items-center justify-center w-[100px] h-14">
                <Link href="/">
                    <a><Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /></a>
                </Link>
            </div>
            <div className="grow align-middle flex justify-center space-x-8 items-center">
                {
                    links.map(([title, url, key]) => (
                        <div className="h-2/4 justify-center flex flex-col" key={key}>
                            <Link href={url} key={title}>
                                {/*
                                    Slate is the color
                                    py is padding in the y direction
                                    px is padding in the x direction
                                */}
                                <a className="rounded-md px-3 py-2 font-medium hover:bg-zinc-100">{title}</a>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <div className="w-32 flex justify-center items-center">
                <button className="rounded-md px-3 py-2 h-2/4 hover:bg-slate-100 flex items-center" onClick={handleClick}>
                    Login
                </button>
            </div>
        </div>
    )
}