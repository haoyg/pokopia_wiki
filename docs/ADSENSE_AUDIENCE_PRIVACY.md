# AdSense audience privacy classification

Current code evidence:

- No browser precise-location API is used.
- No Google-domain cookie is set, modified, intercepted, or deleted.
- No personalized ads, remarketing, sensitive audience list, or housing/employment/credit targeting is enabled.
- Advertising and analytics tags are disabled.

Owner classification recorded on 2026-07-21: `general-audience`; the site is not specifically directed to children under 13.

The supported classifications are:

- `general-audience`
- `teen-directed`
- `child-directed`
- `mixed-audience`

Do not infer the classification only from the Pokémon subject matter. Review the intended audience, actual audience evidence, language, visual design, activities, collection practices, and applicable laws.

If any site or section is covered by child or teen requirements:

1. Notify Google using the applicable site or request-level controls.
2. Use Google's current Tag for age treatment (`TFAT`) before requesting ads.
3. Disable personalized advertising and remarketing for affected traffic.
4. Do not collect personal information from minors through the site.
5. Record the classification and review date in `config/privacy-audience.json`.

Official references:

- https://support.google.com/publisherpolicies/answer/10436800?hl=en
- https://support.google.com/adsense/answer/3248194?hl=en
- https://support.google.com/adsense/answer/9009582?hl=en
- https://support.google.com/publisherpolicies/answer/15101728?hl=en
