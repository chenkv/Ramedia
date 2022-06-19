import { useUser } from '@auth0/nextjs-auth0'

export default function disconnect() {
  const user = useUser();
  if (user.isLoading) {
    return (
      <h1>Loading...</h1>
    )
  }
  if (!user.user) {
    window.location.href = '/';
  }

  fetch('/api/trakt/logout', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user.user)
  })
  .then((res) => {
    if (res.status == 200) {
      window.location.href = '/profile';
    }
  })

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}