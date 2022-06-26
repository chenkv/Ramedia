import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0'

export default function Disconnect() {
  const user = useUser();
  const router = useRouter();
  const code = router.query.code;

  if (user.isLoading) {
    return (
      <h1>Loading...</h1>
    )
  }
  if (!user.user) {
    window.location.href = '/';
  }

  let codeData = { user_code: code }
  fetch('/api/trakt/get-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(codeData)
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    if (res.response.access_token) {
      var storeData = { user: user.user, token: res }
      fetch('/api/trakt/store-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeData)
      })
      .then(response => {
        if (response.status == 200) {
          window.location.href = '/profile';
        }
      })
    }
  })

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}