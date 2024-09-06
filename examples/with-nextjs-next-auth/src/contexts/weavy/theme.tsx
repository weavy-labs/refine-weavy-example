"use client"
import React, { useContext, useEffect } from "react"
import { theme } from "antd"
import { ColorModeContext } from "@contexts/color-mode"

const { useToken } = theme;

export const WeavyThemeProvider = (props: React.PropsWithChildren) => {
  const { token } = useToken()
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("wy-dark")
    } else {
      document.documentElement.classList.remove("wy-dark")
    }
  }, [mode])

  const styles: React.CSSProperties = {
    display: "contents",
    ["--wy-theme" as string]: token.colorPrimary,
    
    // Fallback when --wy-theme can't be set
    ["--wy-primary" as string]: token.colorPrimary,
    ["--wy-on-primary" as string]: token.Button?.primaryColor
  }

  return (
    <div style={styles}>
      {props.children}
    </div>
  )
}
