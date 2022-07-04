import Image from "next/image";

export default function EpisodePopup({ episode }) {
  if (!episode) {
    return;
  }

  console.log(episode);

  return (
    <div className="w-3/4 h-3/4 bg-white rounded-3xl">
      <div className='relative w-full h-full'>
        <Image
          src={"https://image.tmdb.org/t/p/original" + episode.still_path}
          alt={episode.name}
          layout='fill'
          objectFit='cover'
          quality={100}
          className='rounded-xl' />
      </div>
    </div>
  );
}