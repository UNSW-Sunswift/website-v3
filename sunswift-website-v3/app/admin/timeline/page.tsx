import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import { saveTimelineVideoSetting } from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"
import { achievements, achievementVideoSlug } from "@/lib/cms/static-data"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Timeline",
}

export default async function AdminTimelinePage() {
  const settings = await listCmsRecords("timeline", "published")
  const settingsBySlug = new Map(settings.map((setting) => [setting.slug, setting]))

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" data-admin-timeline-page>
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Timeline CMS
          </p>
          <h1 className="mt-3 text-4xl font-medium">Timeline videos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Toggle achievement videos on the live achievements timeline and edit the video URL
            served to the public page.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-admin-timeline-grid>
          {achievements.map((achievement) => {
            const slug = achievementVideoSlug(achievement)
            const setting = settingsBySlug.get(slug)
            const defaultVideoUrl = setting?.videoUrl ?? achievement.videoMp4 ?? ""
            const defaultVideoEnabled =
              setting?.videoEnabled ?? Boolean(achievement.videoMp4?.trim())

            return (
              <form
                key={slug}
                action={saveTimelineVideoSetting}
                className="grid gap-4 rounded-lg border border-border bg-card p-4"
                data-admin-timeline-record={slug}
              >
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="year" value={achievement.year} />
                <input type="hidden" name="title" value={achievement.title} />

                <div>
                  <p className="font-mono text-[0.68rem] tracking-[0.2em] text-primary uppercase">
                    {achievement.year} · {achievement.vehicle}
                  </p>
                  <h2 className="mt-2 text-base font-medium leading-6">{achievement.title}</h2>
                </div>

                <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <input
                    name="videoEnabled"
                    type="checkbox"
                    defaultChecked={defaultVideoEnabled}
                    className="size-4"
                  />
                  Use video on public timeline
                </label>

                <label className="grid gap-2 text-sm">
                  Video URL
                  <input
                    name="videoUrl"
                    type="url"
                    defaultValue={defaultVideoUrl}
                    placeholder="https://cdn.example.com/timeline-video.mp4…"
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>

                <Button type="submit">Save live video setting</Button>
              </form>
            )
          })}
        </div>
      </section>
    </AdminShell>
  )
}
