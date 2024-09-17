"use client"
import React, { useContext, useEffect } from "react"
import { theme } from "antd"
import { ColorModeContext } from "@contexts/color-mode"

const { useToken } = theme

export const WeavyThemeProvider = (props: React.PropsWithChildren) => {
  const { token } = useToken()
  const { mode } = useContext(ColorModeContext)

  let classNames = mode === "dark" ? "wy-dark" : ""

  const styles: React.CSSProperties & {
    [key: `--${string}`]: string | number | undefined
  } = {
    display: "contents",
    "--wy-theme": token.colorPrimary,
    "--wy-border-radius": `${token.borderRadius}px`,
    "--wy-font-size": `${token.fontSize}px`,
    "--wy-padding": `${token.padding / 2}px`,
    "--wy-button-padding-x": `${token.paddingContentHorizontalSM / 2}px`,
    "--wy-button-padding-y": `${token.paddingContentVerticalSM / 2}px`,
    "--wy-input-padding-x": `${token.paddingContentHorizontalSM / 2}px`,
    "--wy-input-padding-y": `${token.paddingContentVerticalSM / 2}px`,

    // Fallback when --wy-theme can't be set
    "--wy-primary": token.colorPrimary,
    "--wy-on-primary": token.Button?.primaryColor,
  }

  return (
    <div className={classNames} style={styles}>
      {props.children}
    </div>
  )
}
