"use client"
import { WeavyItemCollaboration } from "@components/weavy/item-collaboration"
import { NumberField, Show, TextField } from "@refinedev/antd"
import { useShow } from "@refinedev/core"
import { Flex, Grid, Typography } from "antd"

const { Title } = Typography

export default function CategoryShow() {
  const { query: queryResult } = useShow({})
  const { data, isLoading } = queryResult
  const breakpoint = Grid.useBreakpoint();
  const isSmall = breakpoint.md !== true;

  const record = data?.data

  return (
    <Flex gap="middle" align="stretch" vertical={isSmall}>
      <Show isLoading={isLoading} wrapperProps={{ style: { flex: "1 1 auto" } }}>
        <Title level={5}>{"ID"}</Title>
        <NumberField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
      </Show>
      <WeavyItemCollaboration />
    </Flex>
  )
}
