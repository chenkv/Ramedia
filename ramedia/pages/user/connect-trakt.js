import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect } from 'react';

export default function Disconnect() {
  const user = useUser();
  const router = useRouter();
  const code = router.query.code;

  useEffect(() => {
    async function getToken() {
      if (code && user.user) {
        let codeData = { user_code: code };
        let token = await fetch('/api/trakt/get-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(codeData)
        });
        token = await token.json();

        console.log(token);

        if (token.response.access_token) {
          var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
          userInfo = await userInfo.json();

          var body = {
            user: userInfo.res,
            token: token
          }
      
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          };

          var response = await fetch('/api/trakt/store-token', options);

          if (response.status == 200) {
            window.location.href = '/profile';
          }
        }
      }
    }

    getToken();
  }, [user.isLoading, user.user])

  if (user.isLoading) {
    return (
      <h1>Loading...</h1>
    )
  }
  if (!user.user) {
    window.location.href = '/';
  }

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}