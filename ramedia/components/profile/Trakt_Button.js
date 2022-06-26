import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TraktButton() {
  const user = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true)

  var buttontext = { text: "", link: "" };

  useEffect(() => {
    fetch('/api/trakt/authorize')
      .then((res) => res.json())
      .then((result) => {
        fetch('/api/trakt/is-connected', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user.user)
        })
        .then((res) => res.json())
        .then((info) => {
          if (info.is_connected) {
            buttontext = { text: "Disconnect from Trakt.tv", link: "/user/disconnect-trakt" }
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
    <div className='w-screen h-20 flex text-center justify-start space-x-4'>
      <div className="w-20 h-20 relative">
        <Image src='/trakt-icon-red.svg' alt="trakt.tv icon" layout="fill" />
      </div>
      <Link href={data.link}>
        <a className="rounded-md px-3 py-2 bg-red-600 hover:bg-red-500 flex items-center text-white font-semibold text-lg">{data.text}</a>
      </Link>
    </div>
  )
}