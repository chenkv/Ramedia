import { useEffect, useState } from "react";
import CreateListModal from "./dashboard/CreateListModal";

export default function ListPopup({ enabled, handleList, id, user }) {
  const [ userLists, setUserLists ] = useState(null);
  const [ updateList, setUpdateList ] = useState(false);

  useEffect(() => {
    async function getUserLists() {
      if (user.user) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
        };
    
        var response = await fetch('/api/user/lists?user=' + userInfo.res.id, options);
        response = await response.json();

        setUserLists(response);
      }
    }

    getUserLists();
  }, [user.user, updateList])

  if (!enabled) {
    return;
  }

  async function addToList(listID) {
    for (let i in userLists.lists) {
      for (let j in i.elements) {
        if (j == listID) {
          // Add popup to confirm if the user wants to add a duplicate
        }
      }
    }

    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    const body = {
      media_id: id
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    var response = await fetch('/api/user/lists/' + listID, options);

    handleList(false);
  }

  async function createList() {
    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    let body = {
      user: userInfo.res,
      name: 'New List',
      description: '',
      initial_value: id
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    await fetch('/api/user/lists', options);

    setUpdateList(!updateList);
    handleList(false);
  }

  return (
    <div className="absolute bottom-full flex flex-col items-center">
      <div className=" px-4 pt-2 flex flex-col bg-[#e0e0e0] rounded-lg shadow-[6px_6px_10px_0px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl text-center mb-1 font-semibold">Add to List</h2>

        <div className="max-h-52 py-0.5 overflow-auto w-full border-y-2 border-double border-black">
          {
            userLists.lists.map((element) => (
              <div key={element.id} className="px-2 py-2 hover:bg-[#FF971D] hover:text-white rounded-md hover:cursor-pointer" onClick={() => addToList(element.id)}>
                <h3>{element.name}</h3>
              </div>
            ))
          }
        </div>

        <button className="my-0.5 px-2 py-2 hover:bg-[#FF971D] hover:text-white rounded-md" onClick={() => createList()}>
          <p className="w-full text-left">New List</p>
        </button>
      </div>
    </div>
  )

}