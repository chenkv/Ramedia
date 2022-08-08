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

  const updateUsername = async (event) => {
    event.preventDefault();
    console.log(event.target.username.value)

    // var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
    // userInfo = await userInfo.json();

    // let body = {
    //   user: userInfo.res,
    //   name: event.target.listname.value,
    //   description: event.target.listdescription.value
    // }

    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // }

    // await fetch('/api/user/lists', options);
  }

  const test = async (event) => {
    const currValue = event.target.value;
    const inputDiv = document.getElementById('username');
    const errorDiv = document.getElementById("username_error");
    errorDiv.innerHTML = "Max length of 20 characters";
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
                  <form className="flex flex-col space-y-4" onSubmit={updateUsername}>
                    <div className="flex space-x-2 ml-1">
                      <label htmlFor='username'>Username:</label>
                      <input type='text' id='username' defaultValue={user.nickname} className='px-2 rounded-md focus:outline-2 focus:outline-[#FF971D]' onChange={test} maxLength={20} />
                      <p id="username_error" className="text-red-500 font-semibold"></p>
                    </div>

                    <div className="flex space-x-2 ml-1">
                      <label htmlFor='email'>Email:</label>
                      <input type='text' id='email' defaultValue={user.email} className='px-2 rounded-md focus:outline-2 focus:outline-[#FF971D] w-1/3' disabled={true} />
                    </div>

                    <div className="w-full text-center">
                      <input type='submit' value='Save Changes' className="w-min px-2 py-1 rounded-lg bg-[#FF971D] bg-opacity-80 hover:bg-opacity-30 transition-all ease-linear duration-150"/>
                    </div>
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