import Image from 'next/image';
import cornerPic from '../public/corner.png';

export default function ListPopup({ enabled }) {


  if (!enabled) {
    return;
  }

  return (
    <div className="absolute bottom-full flex flex-col items-center">
      <div className=" px-4 pt-2 flex flex-col bg-[#d3d1d1] rounded-xl">
        <h2 className="text-xl text-center">Lists</h2>

        <div className="h-12 w-full border-b-2 border-double">

        </div>

        <button className="my-2 hover:bg-blue-600 rounded-xl">
          <p classname="w-full text-left">New List</p>
        </button>
      </div>

      <Image src={cornerPic} layout='raw' quality={100} />
    </div>
  )

}