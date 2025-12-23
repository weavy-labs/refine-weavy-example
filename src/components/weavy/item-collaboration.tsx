"use client"
import useHash from "@hooks/hash/useHash"
import { usePageNavigation } from "@hooks/weavy/usePageNavigation"
import { useGo, useParsed } from "@refinedev/core"
import { WeavyTypes, WyChat, WyFiles, WyPosts } from "@weavy/uikit-react"
import { Card } from "antd"
import { LegacyRef, useEffect, useState } from "react"

export function WeavyItemCollaboration({ id }: { id?: string | number}) {
  const { pathname } = useParsed()
  const go = useGo()
  const hash = useHash()

  // Tab definition
  const tabList = [
    {
      key: "posts",
      label: "Feeds",
    },
    {
      key: "chat",
      label: "Chat",
    },
    {
      key: "files",
      label: "Files",
    },
  ]

  // Tab content
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Check the #hash from the URL to show any matching tab, otherwise default to "posts"
    return tabList.find((tab) => tab.key === hash) ? hash : "posts"
  })


  const componentRefCallback = usePageNavigation(() => `${pathname}#${activeTab}`, [id]);

  // We encode the path of each tab into the uid using base-64 encoding to be able to navigate to each tab from notifications.
  const tabContent: Record<string, React.ReactNode> = {
    posts: <WyPosts uid={`refine:blog-posts:${id}:posts`} ref={componentRefCallback as LegacyRef<WeavyTypes.WyPosts> | undefined} />,
    chat: <WyChat uid={`refine:blog-posts:${id}:chat`} ref={componentRefCallback as LegacyRef<WeavyTypes.WyChat> | undefined} />,
    files: <WyFiles uid={`refine:blog-posts:${id}:files`} ref={componentRefCallback as LegacyRef<WeavyTypes.WyFiles> | undefined} />,
  }


  useEffect(() => {
    // Check the #hash from the URL to show any matching tab when hash changes
    if (hash in tabContent) {
      setActiveTab(hash)
    }
  }, [hash])

  const onTabChange = (key: string) => {
    setActiveTab(key)

    if (hash !== key) {
      // Update the hash in navigation when the tab changes
      go({ hash: key })
    }
  }

  return (
    <Card
      style={{
        flex: "0 0 320px",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          display: "flex",
          flex: "1 0 480px",
          overflow: "hidden",
          padding: activeTab === "posts" ? "1rem" : "0",
        },
      }}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={onTabChange}
    >
      {id !== undefined ? tabContent[activeTab] : null}
    </Card>
  )
}
