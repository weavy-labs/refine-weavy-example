"use client"
import { WeavyMessenger } from "@components/weavy/messenger"
import { WeavyNotifications } from "@components/weavy/notifications"
import { ColorModeContext } from "@contexts/color-mode"
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd"
import { useGetIdentity } from "@refinedev/core"
import { Layout as AntdLayout, Avatar, Flex, Space, Switch, Typography, theme } from "antd"
import React, { useContext } from "react"

const { Text } = Typography
const { useToken } = theme

type IUser = {
  id: number
  name: string
  avatar: string
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken()
  const { data: user } = useGetIdentity<IUser>()
  const { mode, setMode } = useContext(ColorModeContext)

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  }

  if (sticky) {
    headerStyles.position = "sticky"
    headerStyles.top = 0
    headerStyles.zIndex = 1
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Flex align="center" gap="small">
        <Switch checkedChildren="🌛" unCheckedChildren="🔆" onChange={() => setMode(mode === "light" ? "dark" : "light")} defaultChecked={mode === "dark"} />
        {(user?.name || user?.avatar) && (
          <Flex style={{ marginLeft: "8px" }} align="center" gap="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
          </Flex>
        )}
        <WeavyNotifications />
        <WeavyMessenger />
      </Flex>
    </AntdLayout.Header>
  )
}
