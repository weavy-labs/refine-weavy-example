"use client"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Badge, Button, Drawer } from "antd"
import { ConversationTypes, WeavyContext, WyLinkEventType, WyNotifications, WyNotificationsEventType, WyNotificationToasts } from "@weavy/uikit-react"
import { WeavyThemeProvider } from "@contexts/weavy/theme"
import { BellOutlined } from "@ant-design/icons"
import { useCustom, useGo, useNotification, useParsed } from "@refinedev/core"

export const WeavyNotifications: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  const weavy = useContext(WeavyContext)

  const go = useGo()
  const { pathname } = useParsed()

  const { open: openNotification } = useNotification()

  const showDrawer = () => {
    setOpen(true)
  }

  const closeDrawer = () => {
    setOpen(false)
  }

  const updateNotificationCount = async () => {
    if (weavy) {
      const queryParams = new URLSearchParams({
        type: "",
        countOnly: "true",
        unread: "true",
      })
      const response = await weavy.get(`/api/notifications?${queryParams.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setNotificationCount(result.count)
      }
    }
  }

  const handleNotifications = (e: WyNotificationsEventType) => {
    if (e.detail.notification && e.detail.action === "notification_created") {
      openNotification?.({
        message: e.detail.notification.plain,
        // @ts-expect-error empty type for plain notification
        type: "",
      })
    }
    updateNotificationCount()
  }

  const handleLink = (e: WyLinkEventType) => {
    const appType = e.detail.app?.type
    let appUid = e.detail.app?.uid

    if (appUid) {
      appUid = decodeURIComponent(appUid)
    }

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
  }

  useEffect(() => {
    if (weavy) {
      weavy.notificationEvents = true
      weavy.host?.addEventListener("wy:notifications", handleNotifications)
      updateNotificationCount()
      return () => {
        weavy.host?.removeEventListener("wy:notifications", handleNotifications)
      }
    }
  }, [weavy])

  return (
    <>
      <Badge count={notificationCount}>
        <Button
          type="default"
          onClick={showDrawer}
          title="Notifications"
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<BellOutlined />}
        ></Button>
      </Badge>
      <Drawer onClose={closeDrawer} open={open} styles={{ body: { padding: 0 } }}>
        <WeavyThemeProvider>
          <WyNotifications onWyLink={handleLink} />
        </WeavyThemeProvider>
      </Drawer>
    </>
  )
}
