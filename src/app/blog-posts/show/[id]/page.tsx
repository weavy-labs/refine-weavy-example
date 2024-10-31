"use client";
import {
  DateField,
  MarkdownField,
  NumberField,
  Show,
  TextField,
} from "@refinedev/antd";
import { useOne, useParsed, useShow } from "@refinedev/core";
import { Space, Typography } from "antd";
import { WyComments } from "@weavy/uikit-react";
import { usePageNavigation } from "@hooks/weavy/usePageNavigation";

const { Title } = Typography;

export default function BlogPostShow() {
  const { query: queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  
  const record = data?.data;
  
  const { data: categoryData, isLoading: categoryIsLoading } = useOne({
    resource: "categories",
    id: record?.category?.id || "",
    queryOptions: {
      enabled: !!record,
    },
  });
  
  // Construct an uid
  const commentsUid = record?.id ? `refine:categories:${record?.id}:comment`: undefined
  
  // Save page metadata for navigation
  const { pathname } = useParsed();
  const componentRefCallback = usePageNavigation(() => `${pathname}`, [commentsUid]);

  return (
    <Space direction="vertical" size="middle">
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <NumberField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Content"}</Title>
        <MarkdownField value={record?.content} />
        <Title level={5}>{"Category"}</Title>
        <TextField
          value={
            categoryIsLoading ? <>Loading...</> : <>{categoryData?.data?.title}</>
          }
        />
        <Title level={5}>{"Status"}</Title>
        <TextField value={record?.status} />
        <Title level={5}>{"CreatedAt"}</Title>
        <DateField value={record?.createdAt} />
      </Show>
      <WyComments uid={commentsUid} ref={componentRefCallback} notifications="none" />
    </Space>
  );
}
