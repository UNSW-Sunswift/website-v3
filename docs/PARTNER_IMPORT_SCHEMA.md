# Partner Import Schema

Use CSV for bulk partner uploads in `/admin/partners`. The importer overwrites draft
records with the same generated slug and leaves published records unchanged until you
publish the selected drafts.

## Columns

| Column | Required | Notes |
| --- | --- | --- |
| `Name` | Yes | Partner display name. `Partners` is also accepted for Webflow exports. |
| `Website` | No | Partner destination URL. `Partner Website` is also accepted. Defaults to `#`. |
| `Logo` | No | Existing CMS asset key, public URL, or staged logo path. Manual edit also accepts a logo URL. |
| `Sort Order` | No | Optional number for display ordering. If omitted, import row order is used. |
| `Slug` | No | Optional stable key. If omitted, the slug is generated from `Name`. |

## Example

```csv
Name,Website,Logo,Sort Order,Slug
Example Partner,https://example.com,public-media/partners/example-logo.svg,10,example-partner
Another Sponsor,https://sponsor.example,,20,
```

## Publish Flow

1. Upload the CSV from `/admin/partners`, or paste a CSV URL.
2. Review imported drafts in the partner editor.
3. Select the draft cards in the batch-publish grid.
4. Publish selected partners; successful records move out of the draft window.
