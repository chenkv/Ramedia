import { useUser } from "@auth0/nextjs-auth0"

export default function MoviesHome() {
  const user = useUser();

  if (user.isLoading) {
    return (
      <h1>Loading!</h1>
    )
  }

  fetch('/api/user/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user.user)
  })
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        window.location.href = '/profile';
      }
    })

  return (
    <div>
      <h1>Loading!</h1>
    </div>
  )
}