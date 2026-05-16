# CMS Admin Dashboard User Guide

This guide covers the CMS staging dashboard for Sunswift Racing. The admin UI lets you import Webflow CSVs, manually add records, edit drafts, and publish content to the public site.

## Quick start

1. Sign in at `/admin` with an authorized Google account (or the local developer account in non-production).
2. Use the dashboard tiles to jump to Team, Roles, Partners, or Assets.
3. Work in drafts first. Publishing copies draft records into the public collection.
4. Always verify the public route after publishing.

## Access and accounts

- Production uses Google OAuth and `AUTHORIZED_ADMIN_EMAILS`.
- Local testing can use `developer@sunswift.unsw.edu.au` if `ENABLE_DEV_ADMIN_LOGIN` is enabled.
- If you cannot see the dashboard, you are not authenticated.

## Drafts vs published

- Drafts live only in the admin staging collection.
- Publish creates or updates the public record used by the website.
- Delete removes the draft and the published record for the selected internal record key.

## Team members

Location: `/admin/team`

What you can do:
- Import Webflow or roster CSVs (creates drafts only).
- Manually add a team member (details panel at the top).
- Edit existing drafts (name, role, department, hierarchy, additional roles, sort order, etc.).
- Stage a headshot image (stored in the CMS assets bucket).
- Publish one member, or use Publish all team members to copy every draft to the public team page.
- Delete to remove the draft and published record.

Tips:
- Team record keys are generated from names and hidden in the admin UI.
- Department and hierarchy are restricted to the approved dropdown values.
- CSV imports ignore vestigial Webflow Slug, Discipline, and Bio columns.
- Sort order controls the roster order on the public page.
- If you delete every team member, the public site will fall back to placeholder data.

## Recruitment roles

Location: `/admin/recruitment`

What you can do:
- Import Webflow recruitment CSVs (creates drafts only).
- Manually add a role (details panel at the top).
- Edit descriptions, discipline, school, and HTML blocks.
- Set Active to hide or show the role in public listings.
- Publish to the public recruitment pages.
- Delete to remove the draft and published record.

Tips:
- Responsibilities/Requirements fields accept HTML snippets from Webflow.
- Use sort order to control the listing priority inside each stream.

## Partners

Location: `/admin/partners`

What you can do:
- Import Webflow partner CSVs (creates drafts only).
- Manually add a partner (details panel at the top).
- Stage a logo upload or keep the initials placeholder.
- Edit website links and sort order.
- Publish to the public partners grid.
- Delete to remove the draft and published record.

Tips:
- Use full URLs for partner websites (including https://).

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
2. Click Publish for each record you want live.
3. Visit the public page to confirm output:
   - Team: `/team`
   - Recruitment: `/recruitment` and `/recruitment/available-roles`
   - Partners: `/partners`

## Troubleshooting

- If a record does not appear, confirm it is published and Active (roles).
- If a logo/headshot does not show, re-upload the staged file and save draft again.
- If you need to remove a record from the public site, use Delete.
