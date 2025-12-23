"use client";
import React, { useContext, useEffect, useState } from "react";
import { Badge, Button, Drawer } from "antd";
import {
  MessengerTypes,
  WeavyContext,
  WyLinkEventType,
  WyNotifications,
  WyNotificationEventType,
  WeavyType,
} from "@weavy/uikit-react";
import { WeavyThemeProvider } from "@contexts/weavy/theme";
import { BellOutlined } from "@ant-design/icons";
import { useGo, useNotification, useParsed } from "@refinedev/core";

export const WeavyNotifications: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { open: openNotification } = useNotification();
  const { pathname } = useParsed();
  const go = useGo();

  const weavy: WeavyType = useContext(WeavyContext as React.Context<WeavyType>);

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const handleLink = async (e: WyLinkEventType) => {
    const appType = e.detail.link?.app?.type;

    console.log("Opening link", e.detail)

    // Check if the appType guid exists in the MessengerTypes map
    if (appType && MessengerTypes.has(appType)) {
      // Show the messenger
      go({ hash: "messenger" });
      closeDrawer();
    } else if (e.detail.source_name === "refine") {
      const route = e.detail.source_data;

      // We can navigate if there is page metadata
      if (route) {
        console.log("Trying to navigate", route);

        // Only navigate if necessary
        if (!pathname?.startsWith(route)) {
          go({ to: route });
        }
        closeDrawer();
      }
    } else if (e.detail.source_url) {
      // Open link to external app
      window.open(e.detail.source_url, "_blank");
    }
  };

  const updateNotificationCount = async () => {
    if (weavy) {
      // Fetch notification count from the Weavy Web API.
      // See https://www.weavy.com/docs/reference/web-api/notifications#list-notifications

      const queryParams = new URLSearchParams({
        type: "",
        countOnly: "true",
        unread: "true",
      });

      // Use weavy.fetch() for fetching from the Weavy Web API to fetch on behalf of the currently authenticated user.
      const response = await weavy.fetch(
        `/api/notifications?${queryParams.toString()}`
      );
      if (response.ok) {
        const result = await response.json();

        // Update the count
        setNotificationCount(result.count);
      }
    }
  };

  const handleNotifications = (e: WyNotificationEventType) => {
    if (e.detail) {
      // Only show notifications when a new notification is received

      // Show notifications using the Refine API
      openNotification?.({
        message: e.detail.title,
        // @ts-expect-error empty type for plain notification
        type: "",
      });
    }

    // Always update the notification count when notifications updates are received
    updateNotificationCount();
  };

  useEffect(() => {
    if (weavy) {
      // Get initial notification count
      updateNotificationCount();

      // Add a realtime notification event listener
      weavy.host?.addEventListener("wy-notification", handleNotifications);

      return () => {
        // Unregister the event listener when the component is unmounted
        weavy.host?.removeEventListener(
          "wy-notification",
          handleNotifications
        );
      };
    }
  }, [weavy]);

  return (
    <>
      <Badge count={notificationCount}>
        <Button
          type="default"
          onClick={showDrawer}
          title="Notifications"
          icon={<BellOutlined />}
        ></Button>
      </Badge>
      <Drawer
        title="Notifications"
        onClose={closeDrawer}
        open={open}
        styles={{ body: { padding: 0 } }}
      >
        <WeavyThemeProvider>
          <WyNotifications onWyLink={handleLink} />
        </WeavyThemeProvider>
      </Drawer>
    </>
  );
};
