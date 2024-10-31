"use server"
import { WeavyTypes } from "@weavy/uikit-react"

/**
 * Sets page metadata for an app.
 * The metadata is used when clicking notifications to be able to navigate back to the component that generated the content.
 */
export const setPageNavigation = async (uid: string, path: string) => {
  let app: WeavyTypes.AppType | undefined

  {
    // Check for any existing metadata
    const response = await fetch(new URL(`/api/apps/${uid}`, process.env.NEXT_PUBLIC_WEAVY_URL), {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.WEAVY_APIKEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Could fetch app: ${uid}`)
    }
    app = await response.json()
  }

  // Only set the metadata if it's not set already.
  if (app && !app.metadata?.page) {
    console.log("Setting page navigation", uid)

    const body = JSON.stringify({
      metadata: Object.assign({}, app.metadata, {
        page: path,
      }),
    })

    const response = await fetch(new URL(`/api/apps/${uid}`, process.env.NEXT_PUBLIC_WEAVY_URL), {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.WEAVY_APIKEY}`,
      },
      body,
    })

    if (!response.ok) {
      throw new Error(`Could not update app metadata: ${uid}`)
    }
  }
}
