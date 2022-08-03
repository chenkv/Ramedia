import CreateListModal from "./CreateListModal";
import ListPopup from "./ListPopup";
import { useState, useEffect } from "react";

export default function Lists({ lists, user }) {
  const [ createModal, setCreateModal ] = useState(false);
  const [ listModal, setListModal ] = useState(false);
  const [ selectedList, setSelectedList ] = useState(null);

  console.log(lists)

  useEffect(() => {
    if (createModal || listModal) {
      let modaldiv = document.getElementById("modal");
      if (modaldiv) {
        modaldiv.style.top = window.scrollY + 'px';
      }
    }
  }, [createModal, listModal])

  function createModalHandler(option) {
    setCreateModal(option);
  }

  function listModalHandler(option, list) {
    setListModal(option);
    setSelectedList(list);
  }

  return (
    <div className="w-full h-screen pt-4 px-4">
      <div className="relative w-full flex justify-center border-b-4 border-[#FF971D] py-4">
        <h1 className='w-min text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#DE15FF] to-[#FF971D] font-bold tracking-wider'>Lists</h1>

        <button className="absolute right-4 top-0 flex items-center mt-6 px-4 py-2 bg-white rounded-xl shadow-xl transition-all ease-out duration-300 hover:scale-110 active:scale-90 font-semibold tracking-wider" onClick={() => setCreateModal(true)}>
          Create list
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {
        function () {
          if (!lists) {
            return (
              <div className="w-full h-full flex flex-col items-center justify-center text-center">
                <p className="text-xl w-2/4">Lists are a great way to organize your thoughts and share them with your friends! Get started by clicking the button below.</p>

                <button className="flex items-center mt-6 px-4 py-2 bg-[#FFE8D6] rounded-xl shadow-xl transition-all ease-out duration-300 hover:scale-110 active:scale-90 font-semibold tracking-wider" onClick={() => setCreateModal(true)}>
                  Create list
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          } else {
            return (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {
                  lists.lists.map((element) => (
                    <div key={element.id} className="h-52 px-4 rounded-2xl bg-red-300 hover:scale-105 transition-all ease-out duration-100 hover:cursor-pointer" onClick={() => listModalHandler(true, element)}>
                      <h2 className="w-full text-center text-xl">{element.name}</h2>
                      <p>{element.description}</p>
                    </div>
                  ))
                }
              </div>
            )
          }
        } ()
      }

      <CreateListModal enabled={createModal} modalHandler={createModalHandler} user={user} />
      <ListPopup enabled={listModal} modalHandler={listModalHandler} list={selectedList} />
    </div>
  )
}