"use client"
import React, { useContext, useEffect, useState } from "react"
import { Badge, Button, Drawer } from "antd"
import { ConversationTypes, WeavyContext, WyLinkEventType, WyNotifications, WyNotificationsEventType } from "@weavy/uikit-react"
import { WeavyThemeProvider } from "@contexts/weavy/theme"
import { BellOutlined } from "@ant-design/icons"
import { useGo, useNotification, useParsed } from "@refinedev/core"

export const WeavyNotifications: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const { open: openNotification } = useNotification()
  const { pathname } = useParsed()
  const go = useGo()

  const weavy = useContext(WeavyContext)

  const showDrawer = () => {
    setOpen(true)
  }

  const closeDrawer = () => {
    setOpen(false)
  }

  const updateNotificationCount = async () => {
    if (weavy) {
      // Fetch notification count from the Weavy Web API.
      // See https://www.weavy.com/docs/reference/web-api/notifications#list-notifications

      const queryParams = new URLSearchParams({
        type: "",
        countOnly: "true",
        unread: "true",
      })

      // Use weavy.get() for fetching from the Weavy Web API to fetch on behalf of the currently authenticated user.
      const response = await weavy.get(`/api/notifications?${queryParams.toString()}`)
      if (response.ok) {
        const result = await response.json()

        // Update the count
        setNotificationCount(result.count)
      }
    }
  }

  const handleNotifications = (e: WyNotificationsEventType) => {
    if (e.detail.notification && e.detail.action === "notification_created") {
      // Only show notifications when a new notification is received

      // Show notifications using the Refine API
      openNotification?.({
        message: e.detail.notification.plain,
        // @ts-expect-error empty type for plain notification
        type: "",
      })
    }

    // Always update the notification count when notifications updates are received
    updateNotificationCount()
  }

  const handleLink = (e: WyLinkEventType) => {
    const appType = e.detail.app?.type
    let appUid = e.detail.app?.uid

    // Check if the appType guid exists in the ConversationTypes map
    if (ConversationTypes.has(appType as string)) {
      // Show the messenger
      go({ hash: "messenger" })
      closeDrawer()
    } else if (appUid) {
      // Show a contextual block by navigation to another page

      // The uid should look something like "refine:adb567a"
      // We have embedded base-64 encoded path information in the uid and to use it we need to decode it.
      if (appUid.startsWith("refine:")) {
        let [_prefix, route] = appUid.split(":")

        if (route) {
          // decode base-64 encoded pathname
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
      // Configure realtime notifications listener
      weavy.notificationEvents = true

      // Add a realtime notification event listener
      weavy.host?.addEventListener("wy:notifications", handleNotifications)
      
      // Get initial notification count
      updateNotificationCount()

      return () => {
        // Unregister the event listener when the component is unmounted
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
