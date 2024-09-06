"use client"
import { useIsAuthenticated } from "@refinedev/core"
import { WyContext } from "@weavy/uikit-react"
import React, { useEffect } from "react"
import { tokenFactory, updateUser } from "@providers/weavy/authentication"
import { WeavyThemeProvider } from "./theme"


export const WeavyContextProvider = (props: React.PropsWithChildren) => {
  const { data: identity } = useIsAuthenticated()

  useEffect(() => {
    if (identity?.authenticated) {
      updateUser()
    }
  }, [identity?.authenticated])

  return (
    <WyContext url={process.env.NEXT_PUBLIC_WY_URL} tokenFactory={tokenFactory}>
      <WeavyThemeProvider>
        {props.children}
      </WeavyThemeProvider>
    </WyContext>
  )
}
