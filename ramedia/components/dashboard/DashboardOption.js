import { useEffect, useState } from "react";
import Watchlist from "./Watchlist";
import History from "./History";
import Lists from "./Lists";

export default function DashboardOption({ page, user }) {
  const [ watchlist, setWatchlist ] = useState(null);
  const [ history, setHistory ] = useState(null);
  const [ lists, setLists ] = useState(null);

  useEffect(() => {
    async function getData() {
      if (!user.isLoading) {
        var userInfo = await fetch(`/api/user/email/'${user.user.email}'`);
        userInfo = await userInfo.json();

        if (page == "Watchlist") {
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
      
          var response = await fetch('/api/user/bookmark/get-watchlist', options);
          response = await response.json();
          setWatchlist(response);
        }

        if (page == "Lists") {
          const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
          };
      
          var response = await fetch('/api/user/lists?user=' + userInfo.res.id, options);
          response = await response.json();
          setLists(response);
        }

        if (page == "History") {      
          const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
          };
      
          var response = await fetch('/api/user/history?user=' + userInfo.res.id, options);
          response = await response.json();
          setHistory(response);
        }
      }
    }

    getData();
  }, [page]);

  if (page == "Watchlist") {
    return <Watchlist watchlist={watchlist} />
  }

  if (page == "Lists") {
    return (
      <Lists lists={lists} user={user}/>
    )
  }

  if (page == "History") {
    return <History history={history} />
  }

  return (
    <div></div>
  )
}