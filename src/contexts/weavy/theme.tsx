"use client"
import React, { useContext } from "react"
import { theme } from "antd"
import { ColorModeContext } from "@contexts/color-mode"

const { useToken } = theme

export const WeavyThemeProvider = (props: React.PropsWithChildren) => {
  const { token } = useToken()
  const { mode } = useContext(ColorModeContext)

  // Follow the dark theme
  let classNames = mode === "dark" ? "wy-dark" : ""

  // Link Ant design tokens to Weavy CSS variables
  const styles: React.CSSProperties & {
    [key: `--${string}`]: string | number | undefined
  } = {
    display: "contents",

    "--wy-theme-color": token.colorPrimary,
    "--wy-font-size": `${token.fontSize}px`,
    "--wy-border-radius": `${token.borderRadius}px`,
    "--wy-avatar-border-radius": "50%",
    "--wy-padding": `${token.padding / 2}px`,

    "--wy-button-padding-x": `${token.paddingContentHorizontalSM / 2}px`,
    "--wy-button-padding-y": `${token.paddingContentVerticalSM / 2}px`,
    "--wy-input-padding-x": `${token.paddingContentHorizontalSM / 2}px`,
    "--wy-input-padding-y": `${token.paddingContentVerticalSM / 2 }px`,

    "--wy-primary": token.colorPrimary,
    "--wy-on-primary": token.Button?.primaryColor,
  }

  return (
    <div className={classNames} style={styles}>
      {props.children}
    </div>
  )
}
