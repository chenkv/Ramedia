import { useState } from "react";
import Trakt_Button from '../../components/profile/Trakt_Button';

export default function Menu({ user }) {
  const [ option, setOption ] = useState('profile');

  async function changeOption(i) {
    setOption(i);
  }

  const MenuOption = ({ text, name }) => (
    <button className="text-right px-4 py-2 hover:bg-gray-200 hover:cursor-pointer focus:bg-gray-200" onClick={() => changeOption(name)}>
      {text}
    </button>
  );

  const updateUserInfo = async (event) => {
    event.preventDefault();
    console.log(event.target.listname.value)

    var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    userInfo = await userInfo.json();

    let body = {
      user: userInfo.res,
      name: event.target.listname.value,
      description: event.target.listdescription.value
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    await fetch('/api/user/lists', options);

    modalHandler(false);
  }

  return (
    <div className="w-full flex">
      <div className="w-[15%] py-4 flex flex-col space-y-2 border-r-4">
        <MenuOption text='Profile' name='profile' />
        <MenuOption text='External Apps' name='external' />
      </div>

      <div className="grow">
        {
          function () {
            if (option == 'profile') {
              return (
                <div className="w-full m-4">
                  <form className="" onSubmit={updateUserInfo}>
                    <label htmlFor='nickname'>Name of list:</label>
                    <input type='text' id='nickname' value={user.nickname} />
                    <input type='submit' value='Submit' className=""/>
                  </form>
                </div>
              )
            }

            if (option == 'external') {
              return (
                <div className="m-4">
                  <Trakt_Button />
                </div>
              )
            }
          } ()
        }
      </div>
    </div>
  )
};