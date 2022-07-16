import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TraktButton() {
  const user = useUser();
  const [ buttonText, setButtonText ] = useState({ text: "", link: "" });

  useEffect(() => {
    async function traktInfo() {
      if (!user.isLoading && user.user) {
        let authorizeLink = await fetch('/api/trakt/authorize');
        authorizeLink = await authorizeLink.json();

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

        let isConnected = await fetch('/api/trakt/is-connected', options);
        isConnected = await isConnected.json();

        if (isConnected.is_connected) {
          setButtonText({ text: "Disconnect from Trakt.tv", link: "/user/disconnect-trakt" });
        } else {
          setButtonText({ text: "Connect to Trakt.tv", link: authorizeLink.link });
        }
      }
    }

    traktInfo();
  }, [user.isLoading, user.user])

  return (
    <div className='w-screen h-20 flex text-center justify-start space-x-4'>
      <div className="w-20 h-20 relative">
        <Image src='/trakt-icon-red.svg' alt="trakt.tv icon" layout="fill" />
      </div>
      <Link href={buttonText.link}>
        <a className="rounded-md px-3 py-2 bg-red-600 hover:bg-red-500 flex items-center text-white font-semibold text-lg">{buttonText.text}</a>
      </Link>
    </div>
  )
}