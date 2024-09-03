"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { WyComments } from "@weavy/uikit-react";
//import dynamic from "next/dynamic";

/*const WyComments = dynamic(async () => (await import('@weavy/uikit-react')).WyComments, {
  ssr: false,
})*/

export default function CategoryShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <Show isLoading={isLoading}>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {"ID"}
          </Typography>
          <TextField value={record?.id} />
          <Typography variant="body1" fontWeight="bold">
            {"Title"}
          </Typography>
          <TextField value={record?.title} />
        </Stack>
      </Show>
      <WyComments uid={`category-comments-${record?.id}`} notifications="none" />
    </>
  );
}
