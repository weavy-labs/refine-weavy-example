"use client"
import { setPageNavigation } from "@providers/weavy/navigation"
import { WeavyTypes } from "@weavy/uikit-react"
import { LegacyRef, useCallback, useEffect, useState } from "react"

export type AppWithPageType = WeavyTypes.AppType & {
  metadata?: WeavyTypes.AppType["metadata"] & {
    page?: string
  }
}

export type WyAppRef = (HTMLElement & { uid?: string | null; whenApp: () => Promise<AppWithPageType> }) | null

/**
 * Calls the page navigation provider to update page metadata for a component.
 * It is only called when the ref is updated or deps change.
 * 
 * @param path - Provides the path to the component. Preferably provide it as a function to make it re-evaluate when deps change.
 * @param deps - Any deps that should be monitored to re-trigger the provider call.
 * @returns Ref callback function to be used with the ref attribute of a component.
 */
export const usePageNavigation = <TRef extends WyAppRef | null = WyAppRef>(path: string | (() => string), deps: React.DependencyList) => {
  const [component, setComponent] = useState<WyAppRef>()

  useEffect(() => {
    if (component && component.uid) {
      // The (current) path to save
      const componentPath: string = typeof path === "function" ? path() : path

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

  // Ref callback function to use with components
  return useCallback((ref: TRef) => {
    const currentComponent = ref?.whenApp ? ref : undefined
    setComponent(currentComponent)
  }, []) as LegacyRef<TRef> | undefined
}
