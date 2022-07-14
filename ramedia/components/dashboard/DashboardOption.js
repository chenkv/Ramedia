import { useEffect, useState } from "react";
import Watchlist from "./Watchlist";

export default function DashboardOption({ page, user }) {
  const [ watchlist, setWatchlist ] = useState(null);

  useEffect(() => {
    async function getData() {
      if (!user.isLoading) {
        if (page == "Watchlist") {
          var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
          userInfo = await userInfo.json();

          var body = {
            user: userInfo.res,
          }
      
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          };
      
          var response = await fetch('/api/user/get-watchlist', options);
          response = await response.json();
          setWatchlist(response);
        }

        if (page == "Favorites") {

        }
      }
    }

    getData();
  }, [page]);

  if (page == "Watchlist") {
    return <Watchlist watchlist={watchlist} />
  }

  if (page == "Favorites") {
    return (
      <div>Favorites!</div>
    )
  }

  return (
    <div></div>
  )
}