"use server"
import authOptions from "@app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export type WeavyUser = {
  name?: string | null
  email?: string | null
  picture?: string | null
}

// Cache for current tokens
const _tokens = new Map<string, string>();

/**
 * Get the currently authenticated user server side from NextAuth.
 * 
 * @returns The `uid` and the `weavyUser` as a `WeavyUser`
 */
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

/**
 * Gets an authentication token server-to-server for the currently authenticated user.
 * 
 * @param refresh - Whether to request a fresh token or use an existing token
 * @returns {string} The current user token
 */
export const tokenFactory = async (refresh: boolean = false) => {
  const user = await getAuthenticatedUser()

  // Try using a cached token if refresh isn't requested
  if (!refresh) {
    const token = _tokens.get(user.uid)
    if (token) {
      console.log("Using cached token", user.uid)
      return token;
    }
  }

  // fetch access_token from server
  const response = await fetch(new URL(`/api/users/${user.uid}/tokens`, process.env.NEXT_PUBLIC_WEAVY_URL), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.WEAVY_APIKEY}`,
    },
    body: JSON.stringify({ expires_in: 3600 }),
  })

  if (response.ok) {
    const data = await response.json()
    const token = data.access_token as string

    // Cache the token
    _tokens.set(user.uid, token)

    // return token to UIKit
    return token
  } else {
    throw new Error("Could not fetch token")
  }
}

/**
 * Updates the currently authenticated user server-to-server.
 */
export const updateUser = async () => {
  const user = await getAuthenticatedUser()

  console.log("Updating weavy user", user.uid)

  const response = await fetch(new URL(`/api/users/${user.uid}`, process.env.NEXT_PUBLIC_WEAVY_URL), {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.WEAVY_APIKEY}`,
    },
    body: JSON.stringify(user.weavyUser),
  })

  if (!response.ok) {
    throw new Error("Could not update user")
  }
}
