"use client"
import { GitHubBanner, Refine, type AuthProvider } from "@refinedev/core"
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar"
import { notificationProvider, RefineSnackbarProvider } from "@refinedev/mui"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import React from "react"

import routerProvider from "@refinedev/nextjs-router"

import { AppIcon } from "@components/app-icon"
import { ColorModeContextProvider } from "@contexts/color-mode"
import { dataProvider } from "@providers/data-provider"

import { WeavyContextProvider } from "@contexts/weavy"
/*import dynamic from "next/dynamic"
const WyContext = dynamic(async () => (await import('@weavy/uikit-react')).WyContext, {
  ssr: false,
})*/


type RefineContextProps = {
  defaultMode?: string
}

export const RefineContext = (props: React.PropsWithChildren<RefineContextProps>) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  )
}

type AppProps = {
  defaultMode?: string
}

const App = (props: React.PropsWithChildren<AppProps>) => {
  const { data: sessionData, status } = useSession()
  const to = usePathname()

  if (status === "loading") {
    return <span>loading...</span>
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn("google", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      })

      return {
        success: true,
      }
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      })

      return {
        success: true,
      }
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        }
      }

      return {
        error,
      }
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        }
      }

      return {
        authenticated: true,
      }
    },
    getPermissions: async () => {
      return null
    },
    getIdentity: async () => {
      if (sessionData?.user) {
        const { user } = sessionData
        return {
          name: user.name,
          avatar: user.image,
        }
      }

      return null
    },
  }

  const defaultMode = props?.defaultMode

  return (
    <>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              resources={[
                {
                  name: "blog_posts",
                  list: "/blog-posts",
                  create: "/blog-posts/create",
                  edit: "/blog-posts/edit/:id",
                  show: "/blog-posts/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "categories",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                title: {
                  text: "Refine: NextJS + MUI + REST + Google",
                  icon: <AppIcon />,
                },
              }}
            >
              <WeavyContextProvider>
                {props.children}
              </WeavyContextProvider>
              <RefineKbar />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  )
}
