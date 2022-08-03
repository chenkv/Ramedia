

export default function ListPopup({ enabled, modalHandler, list }) {
  if (!enabled) return;

  document.addEventListener('scroll', function(e) {
    let modaldiv = document.getElementById("modal");
    if (modaldiv) {
      modaldiv.style.top = window.scrollY + 'px';
    }
  });

  const createList = async (event) => {
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

  console.log(list);

  return (
    <div id="modal"
      className='absolute w-full h-full left-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center'
      onClick={e => {modalHandler(false)}}>

      <div className="relative px-6 pb-4 bg-[#F9F6F7] rounded-3xl overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="absolute right-2 top-2 z-50 cursor-pointer" onClick={() => modalHandler(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full mt-4">
            <h2 className="text-2xl font-semibold">{list.name}</h2>
            <p>{list.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}