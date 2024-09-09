"use server"
import authOptions from "@app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export type WeavyUser = {
  name?: string | null
  email?: string | null
  picture?: string | null
}

export const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("No authenticated user")
  }
  const uid = `refine-user-${session.user.email}`
  const weavyUser: WeavyUser = {
    name: session.user.name,
    email: session.user.email,
    picture: session.user.image,
  }
  return { uid, weavyUser }
}

export const tokenFactory = async (refresh: boolean = false) => {
  const user = await getAuthenticatedUser()

  // fetch access_token from server
  const response = await fetch(new URL(`/api/users/${user.uid}/tokens`, process.env.NEXT_PUBLIC_WY_URL), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.WY_APIKEY}`,
    },
    body: JSON.stringify({ expires_in: 3600 }),
  })

  if (response.ok) {
    const data = await response.json()

    // return access_token to UIKit
    return data.access_token as string
  } else {
    throw new Error("Could not fetch token")
  }
}

export const updateUser = async () => {
  const user = await getAuthenticatedUser()

  console.log("Updating weavy user", user.uid)

  const response = await fetch(new URL(`/api/users/${user.uid}`, process.env.NEXT_PUBLIC_WY_URL), {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.WY_APIKEY}`,
    },
    body: JSON.stringify(user.weavyUser),
  })

  if (!response.ok) {
    throw new Error("Could not update user")
  }
}
