"use client"
import useHash from "@hooks/hash/useHash"
import { useGo, useParsed } from "@refinedev/core"
import { WyChat, WyFiles, WyPosts } from "@weavy/uikit-react"
import { Card } from "antd"
import { useEffect, useState } from "react"

export function WeavyItemCollaboration() {
  const { pathname } = useParsed()
  const go = useGo()
  const hash = useHash()

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

  const contentList: Record<string, React.ReactNode> = {
    posts: <WyPosts uid={`refine:${btoa(`${pathname}#posts`)}`} notifications="none" />,
    chat: <WyChat uid={`refine:${btoa(`${pathname}#chat`)}`} notifications="none" />,
    files: <WyFiles uid={`refine:${btoa(`${pathname}#files`)}`} notifications="none" />,
  }

  const [activeTabKey, setActiveTabKey] = useState<string>(() => (hash in contentList ? hash : "posts"))

  useEffect(() => {
    if (hash in contentList) {
      setActiveTabKey(hash)
    }
  }, [hash])

  const onTabChange = (key: string) => {
    setActiveTabKey(key)
    if (hash !== key) {
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
          padding: activeTabKey === "posts" ? "1rem" : "0",
        },
      }}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  )
}
