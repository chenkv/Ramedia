import { useUser } from "@auth0/nextjs-auth0"
import { useEffect, useState } from "react";

export default function MoviesHome() {
  const user = useUser();

  useEffect(() => {
    const updateData = async () => {
      if (!user.isLoading) {
        const res = await fetch('/api/user/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user.user)
        })

        if (res.status == 200) {
          window.location.href = '/profile';
        }
      }
    }

    updateData();
  }, [user.isLoading])

  return (
    <div>Loading...</div>
  )
}