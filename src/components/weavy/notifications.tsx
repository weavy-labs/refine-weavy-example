"use client"
import React, { useState } from "react"
import { Button, Drawer } from "antd"
import { ConversationTypes, WyNotifications } from "@weavy/uikit-react"
import { WeavyThemeProvider } from "@contexts/weavy/theme"
import { BellOutlined } from "@ant-design/icons"
import { useGo, useParsed } from "@refinedev/core"

export const WeavyNotifications: React.FC = () => {
  const [open, setOpen] = useState(false)

  const go = useGo()
  const { pathname } = useParsed()

  const showDrawer = () => {
    setOpen(true)
  }

  const closeDrawer = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        type="default"
        onClick={showDrawer}
        title="Notifications"
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon={<BellOutlined />}
      ></Button>
      <Drawer onClose={closeDrawer} open={open} styles={{ body: { padding: 0 } }}>
        <WeavyThemeProvider>
          <WyNotifications
            onWyLink={(e) => {
              const appType = e.detail.app?.type
              let appUid = e.detail.app?.uid

              if (appUid) {
                appUid = decodeURIComponent(appUid)
              }

              console.log("LINK", e.detail)

              // Check if the appType guid exists in the ConversationTypes map
              if (ConversationTypes.has(appType as string)) {
                // Show the messenger
                go({ hash: "messenger" })
                closeDrawer()

              } else if (appUid) {
                // Show a contextual block by navigation to another page

                if (appUid.startsWith("refine:")) {
                  let [_prefix, route] = appUid.split(":")

                  if (route) {
                    route = atob(route)
                  }
                  console.log("trying navigate", route)

                  // Only navigate if necessary
                  if (!pathname?.startsWith(route)) {
                    go({ to: route })
                    closeDrawer()
                  }
                }
              }
            }}
          />
        </WeavyThemeProvider>
      </Drawer>
    </>
  )
}
