# CMS Admin Dashboard User Guide

This guide covers the CMS staging dashboard for Sunswift Racing. The admin UI lets you import Webflow CSVs, manually add records, edit drafts, and publish content to the public site.

## Quick start

1. Sign in at `/admin` with an authorized Google account (or the local developer account in non-production).
2. Use the dashboard tiles to jump to Team, Roles, Partners, or Assets.
3. Work in drafts first. Publishing moves draft records into the public collection and removes them from the draft list.
4. Always verify the public route after publishing.

## Access and accounts

- Production uses Google OAuth and `AUTHORIZED_ADMIN_EMAILS`.
- Local testing can use `developer@sunswift.unsw.edu.au` if `ENABLE_DEV_ADMIN_LOGIN` is enabled.
- If you cannot see the dashboard, you are not authenticated.

## Drafts vs published

- Drafts live only in the admin staging collection.
- Publish creates or updates the public record used by the website, then removes the matching draft from the admin draft list.
- A publish status banner appears after publishing and reports success, partial success, or failure counts.
- Delete removes the draft and the published record for the selected internal record key.

## Team members

Location: `/admin/team`

What you can do:
- Import Webflow or roster CSVs (creates drafts only).
- Manually add a team member (details panel at the top).
- Edit existing drafts (name, role, department, hierarchy, additional roles, sort order, etc.).
- Stage a headshot image (stored in the CMS assets bucket).
- Publish one member, or select multiple drafts in the batch publishing panel and publish only those records.
- Delete to remove the draft and published record.

Tips:
- Team record keys are generated from names and hidden in the admin UI.
- Department and hierarchy are restricted to the approved dropdown values.
- CSV imports ignore vestigial Webflow Slug, Discipline, and Bio columns.
- Use Select all for a full batch, or switch to grid view and Zoom out to scan and select many members as compact buttons.
- Sort order controls the roster order on the public page.
- If you delete every team member, the public site will fall back to placeholder data.

## Recruitment roles

Location: `/admin/recruitment`

What you can do:
- Import Webflow recruitment CSVs (creates drafts only).
- Manually add a role (details panel at the top).
- Edit descriptions, discipline, school, and HTML blocks.
- Set Active to hide or show the role in public listings.
- Publish one role, or select multiple drafts in the batch publishing panel and publish only those roles.
- Delete to remove the draft and published record.

Tips:
- Responsibilities/Requirements fields accept HTML snippets from Webflow.
- Use Select all, grid view, and Zoom out for faster review before publishing a larger roles import.
- Use sort order to control the listing priority inside each stream.

## Partners

Location: `/admin/partners`

What you can do:
- Import Webflow partner CSVs (creates drafts only).
- Manually add a partner (details panel at the top).
- Stage a logo upload, paste a logo URL, or import Webflow logo URLs that are copied into the CMS assets bucket.
- Edit website links and sort order.
- Publish one partner, or select multiple drafts in the batch publishing panel and publish only those partners.
- Delete to remove the draft and published record.

Tips:
- Use full URLs for partner websites (including https://).
- Use grid view when scanning many partner names before publishing.

## Assets (registered media)

Location: `/admin/assets`

The assets page is for registering heavy public media that should be served from the public S3/CloudFront bucket. This does not upload files; it records metadata so the site knows what to use.

What you can do:
- Click "Register heavy media" to seed known public-media records.
- Confirm the table shows the key, content type, size, and source path.

When to use it:
- After adding a new large video or image to the public assets bucket.
- When you need the CMS to track a file that should be served via CloudFront.

## Publishing checklist

1. Save draft changes.
2. Click Publish for an individual record, or select records in the batch publishing panel and click the Publish selected button.
3. Visit the public page to confirm output:
   - Team: `/team`
   - Recruitment: `/recruitment` and `/recruitment/available-roles`
   - Partners: `/partners`

## Troubleshooting

- If a record does not appear, confirm it is published and Active (roles).
- If a logo/headshot does not show, re-upload the staged file and save draft again.
- If you need to remove a record from the public site, use Delete.
