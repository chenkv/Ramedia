import { useUser } from '@auth0/nextjs-auth0'
import { useEffect } from 'react';

export default function Disconnect() {
  const user = useUser();
  
  useEffect(() => {
    async function disconnect() {
      if (!user.isLoading && user.user) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        var body = {
          user: userInfo.res
        }

        const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        };

        let logout = await fetch('/api/trakt/logout', options);

        if (logout.status == 200) {
          window.location.href = '/profile';
        }
      }
    }

    disconnect();
  }, [user.isLoading, user.user]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}