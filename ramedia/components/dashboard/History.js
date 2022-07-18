import Link from "next/link";
import Image from "next/image";

export default function History({ history }) {
  if (!history) return;

  console.log(history);

  return (
    <div className="mx-4 w-full">
      <div className="flex justify-center">
        <h1 className='text-3xl pt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D] font-bold'>History</h1>
        <div className='grid gap-4 grid-cols-6'>
            {
              history.movies.map((element) => (
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
    </div>
  )
}