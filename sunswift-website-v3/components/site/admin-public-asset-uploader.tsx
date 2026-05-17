"use client"

import { useId, useState } from "react"
import { Check, Copy, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; message: string }
  | { status: "success"; publicUrl: string; key: string }
  | { status: "error"; message: string }

type PresignResponse = {
  bucket: string
  key: string
  uploadUrl: string
  publicUrl: string
  contentType: string
}

export function AdminPublicAssetUploader() {
  const fileInputId = useId()
  const [state, setState] = useState<UploadState>({ status: "idle" })
  const [copied, setCopied] = useState(false)

  const uploadFile = async (formData: FormData) => {
    const file = formData.get("file")
    const prefix = String(formData.get("prefix") ?? "public-media/uploads").trim()

    if (!(file instanceof File) || file.size === 0) {
      setState({ status: "error", message: "Choose a file before uploading." })
      return
    }

    setCopied(false)
    setState({ status: "uploading", message: "Requesting S3 upload URL…" })

    try {
      const presignResponse = await fetch("/api/admin/public-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          prefix,
        }),
      })

      if (!presignResponse.ok) {
        throw new Error(await presignResponse.text())
      }

      const presign = (await presignResponse.json()) as PresignResponse
      setState({ status: "uploading", message: "Uploading directly to S3…" })

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": presign.contentType,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed with ${uploadResponse.status}`)
      }

      setState({ status: "uploading", message: "Registering public asset…" })

      const completeResponse = await fetch("/api/admin/public-assets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: presign.bucket,
          key: presign.key,
          contentType: presign.contentType,
          size: file.size,
          publicUrl: presign.publicUrl,
        }),
      })

      if (!completeResponse.ok) {
        throw new Error(await completeResponse.text())
      }

      setState({ status: "success", publicUrl: presign.publicUrl, key: presign.key })
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed.",
      })
    }
  }

  const copyUrl = async () => {
    if (state.status !== "success") {
      return
    }

    await navigator.clipboard.writeText(state.publicUrl)
    setCopied(true)
  }

  return (
    <form
      action={uploadFile}
      className="mt-8 rounded-lg border border-border bg-card p-5"
      data-admin-public-asset-uploader
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Large file upload
          </p>
          <h2 className="mt-2 text-2xl font-medium">Upload to public S3</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Use this for video and other heavy files above 5 MB. The browser uploads directly to
            the public media bucket, then this page returns the URL you can paste into content.
          </p>
        </div>
        <Button type="submit" disabled={state.status === "uploading"}>
          <UploadCloud className="size-4" />
          {state.status === "uploading" ? "Uploading…" : "Upload file"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <label htmlFor={fileInputId} className="grid gap-2 text-sm">
          File
          <input
            id={fileInputId}
            name="file"
            type="file"
            className="w-full rounded-md border border-input bg-background p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
        </label>
        <label className="grid gap-2 text-sm">
          S3 key prefix
          <input
            name="prefix"
            defaultValue="public-media/uploads"
            className="rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      <div className="mt-4" aria-live="polite">
        {state.status === "uploading" ? (
          <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.message}
          </p>
        ) : null}
        {state.status === "success" ? (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  Upload complete
                </p>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {state.publicUrl}
                </p>
                <p className="mt-1 break-all font-mono text-[0.68rem] text-muted-foreground">
                  {state.key}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={copyUrl}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy URL"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  )
}
