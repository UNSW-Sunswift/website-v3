"use client"

import { useId, useState } from "react"
import { Check, Copy, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; message: string }
  | { status: "success"; uploads: UploadedAsset[] }
  | { status: "error"; message: string }

type UploadedAsset = {
  filename: string
  publicUrl: string
  key: string
}

type PresignResponse = {
  bucket: string
  key: string
  uploadUrl: string
  publicUrl: string
  contentType: string
}

export function AdminPublicAssetUploader({
  defaultPrefix = "public-media/uploads",
  eyebrow = "Large file upload",
  title = "Upload to public S3",
  description = "Use this for image batches, video and other heavy files. The browser uploads directly to the public media bucket, then this page returns URLs you can paste into content.",
  filesLabel = "Files",
}: {
  defaultPrefix?: string
  eyebrow?: string
  title?: string
  description?: string
  filesLabel?: string
}) {
  const fileInputId = useId()
  const [state, setState] = useState<UploadState>({ status: "idle" })
  const [copied, setCopied] = useState(false)

  const uploadFile = async (formData: FormData) => {
    const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0)
    const prefix = String(formData.get("prefix") ?? defaultPrefix).trim()

    if (files.length === 0) {
      setState({ status: "error", message: "Choose one or more files before uploading." })
      return
    }

    setCopied(false)
    setState({ status: "uploading", message: `Preparing ${files.length} upload${files.length === 1 ? "" : "s"}…` })

    try {
      const uploads: UploadedAsset[] = []

      for (const [index, file] of files.entries()) {
        setState({
          status: "uploading",
          message: `Requesting S3 URL for ${file.name} (${index + 1}/${files.length})…`,
        })

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
        setState({
          status: "uploading",
          message: `Uploading ${file.name} directly to S3 (${index + 1}/${files.length})…`,
        })

        const uploadResponse = await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": presign.contentType,
          },
          body: file,
        })

        if (!uploadResponse.ok) {
          throw new Error(`S3 upload failed for ${file.name} with ${uploadResponse.status}`)
        }

        setState({
          status: "uploading",
          message: `Registering ${file.name} (${index + 1}/${files.length})…`,
        })

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

        uploads.push({
          filename: file.name,
          publicUrl: presign.publicUrl,
          key: presign.key,
        })
      }

      setState({ status: "success", uploads })
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

    await navigator.clipboard.writeText(state.uploads.map((upload) => upload.publicUrl).join("\n"))
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
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-medium">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <Button type="submit" disabled={state.status === "uploading"}>
          <UploadCloud className="size-4" />
          {state.status === "uploading" ? "Uploading…" : "Upload files"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <label htmlFor={fileInputId} className="grid gap-2 text-sm">
          {filesLabel}
          <input
            id={fileInputId}
            name="files"
            type="file"
            multiple
            className="w-full rounded-md border border-input bg-background p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
        </label>
        <label className="grid gap-2 text-sm">
          S3 key prefix
          <input
            name="prefix"
            defaultValue={defaultPrefix}
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
                <div className="mt-2 grid gap-2">
                  {state.uploads.map((upload) => (
                    <div key={upload.key} className="border-t border-emerald-500/20 pt-2 first:border-t-0 first:pt-0">
                      <p className="font-medium text-emerald-700 dark:text-emerald-300">
                        {upload.filename}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                        {upload.publicUrl}
                      </p>
                      <p className="mt-1 break-all font-mono text-[0.68rem] text-muted-foreground">
                        {upload.key}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="button" variant="outline" onClick={copyUrl}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy URLs"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  )
}
