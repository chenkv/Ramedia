import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";

export default function traktButton() {
  const user = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true)

  var buttontext = { text: "", link: "" };

  useEffect(() => {
    fetch('/api/trakt/trakt_authorize')
      .then((res) => res.json())
      .then((result) => {
        fetch('/api/trakt/trakt_isconnected', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user.user)
        })
        .then((res) => res.json())
        .then((info) => {
          if (info.is_connected) {
            buttontext = { text: "Disconnect from Trakt.tv", link: "/user/disconnectTrakt" }
            setData(buttontext);
          } else {
            buttontext = { text: "Connect to Trakt.tv", link: result.link}
            setData(buttontext);
          }
          setLoading(false);
        })
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  return (
    <div className='w-32 h-20 flex text-center'>
      <a href={data.link} className="rounded-md px-3 py-2 hover:bg-[#FFE8D6] flex items-center">{data.text}</a>
    </div>
  )
}