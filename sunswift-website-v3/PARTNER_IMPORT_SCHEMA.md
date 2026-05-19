# Partner Import Schema

The canonical partner import schema lives at
[`../docs/PARTNER_IMPORT_SCHEMA.md`](../docs/PARTNER_IMPORT_SCHEMA.md).

Partner CSV imports support partner names, website URLs, logo URLs, and sort
order columns for CMS staging. Webflow CDN logo URLs are copied into the CMS
assets bucket during import, and the generated CMS asset key is saved on the
draft partner record.

Example header:

```csv
Name,Website,Logo,Sort Order,Slug
```
