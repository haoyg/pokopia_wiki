# AdSense account and site verification

Public evidence verified on 2026-07-21:

- `https://pokopia.cloud/ads.txt` returned HTTP 200 with `text/plain` content.
- The live file contains `google.com, pub-3274781156049995, DIRECT, f08c47fec0942fa0`.
- The repository can modify the global Next.js `<head>` and deploy static output through Cloudflare Pages.

Owner confirmations recorded on 2026-07-21:

1. The AdSense account holder meets the age requirement.
2. The owner already has an AdSense account and should use it instead of creating a duplicate account for the same payee.
3. Publisher ID `pub-3274781156049995` belongs to that account.
4. The owner controls the `pokopia.cloud` domain and its Cloudflare configuration.
5. `pokopia.cloud` is present in AdSense with the status `Getting ready`.

Remaining requirement: only set `adsense_site_status` to `ready` in `config/adsense-account-readiness.json` after Google changes the site status to `Ready`.

Do not store screenshots, account email addresses, payment details, government IDs, or other private account data in this repository. Keep that evidence in the owner's private records.

Official references:

- https://support.google.com/adsense/answer/91205?hl=zh-Hans
- https://support.google.com/adsense/answer/12131223?hl=zh-Hans
