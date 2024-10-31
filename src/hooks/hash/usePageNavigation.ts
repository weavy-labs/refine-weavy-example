"use client";
import { setPageNavigation } from "@providers/weavy/navigation";
import { WeavyTypes } from "@weavy/uikit-react";
import { useCallback, useEffect, useState } from "react";

export type AppWithPageType = WeavyTypes.AppType & {
  metadata?: WeavyTypes.AppType['metadata'] & {
    page?: string
  }
}

export type WyAppRef = HTMLElement & { uid?: string, whenApp: () => Promise<AppWithPageType> } | null

/**
 * Returns the hash from the current location. 
 * Updates when the hash is changed by the browser or by next navigation.
 * 
 * @returns Any current hash without leading #hash sign
 */
export const usePageNavigation = (path: string | (() => string), deps: React.DependencyList) => {
  const [component, setComponent] = useState<WyAppRef>()

  useEffect(() => {
    if (component && component.uid) {
      // The (current) path to save
      const componentPath: string = typeof path === "function" ? path() : path;

      requestAnimationFrame(() => {
        component.whenApp().then((app) => {
          //console.log("Current refine page", component.uid, app.metadata?.page)
          // Check if metadata.page already is set
          if (component.uid && !app.metadata?.page) {
            console.log("Setting refine page", component.uid, componentPath)
            // Update using server function
            setPageNavigation(component.uid, componentPath)
          }
        })
      })
    }
  }, [component, component?.uid, ...deps])


  // Save page metadata if not already set
  return useCallback((ref: WyAppRef | null) => {
    const currentComponent = ref?.whenApp ? ref : undefined
    setComponent(currentComponent)
  }, [])
    
};