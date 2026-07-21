# AdSense Publisher Policy Readiness

Last reviewed: 2026-07-21

This checkpoint follows `ADS-PUB-01` through `ADS-PUB-16` in the local AdSense site auditor checklist. The site is currently a static gaming-information website with browser-side planning tools. Public submissions, user accounts, commerce, software downloads, and advertising are disabled.

## Automated boundary

`scripts/check-publisher-content-policy.js` checks every exported page for prohibited-content signals, unreviewed external destinations, affiliate or campaign parameters, password and upload fields, POST forms, downloads, third-party embeds, and external scripts. Explicit statements that prohibit unsafe activity are not treated as promotion.

The permitted rendered external hosts are limited to official Nintendo, Pokémon, and Google policy/settings pages. Adding another external host fails the build until it is reviewed and deliberately added to `config/publisher-content-policy.json`.

## Checklist status

| ID | Status | Evidence or limitation |
| --- | --- | --- |
| ADS-PUB-01 | Pass | No illegal-activity promotion, commerce, downloads, or rendered unresolved-rights media was found. |
| ADS-PUB-02 | Unknown | Unresolved media-rights evidence remains outstanding even though those media paths are suppressed from exported HTML. |
| ADS-PUB-03 | Pass | No dangerous or derogatory content signals were found. Fictional game combat terms are not treated as promotion of real-world harm. |
| ADS-PUB-04 | Pass | No animal-cruelty promotion or endangered-species commerce was found. |
| ADS-PUB-05 | Pass | Publisher identity, unofficial status, source labels, and non-affiliation disclosures are rendered sitewide. |
| ADS-PUB-06 | Pass | No credential collection, phishing flow, deceptive offer, payment flow, or external script was found. |
| ADS-PUB-07 | Pass | No hacking, cracking, surveillance, fake-document, cheating, or evasion instructions were found. The creative-play page explicitly prohibits ROM hacks and cracked builds. |
| ADS-PUB-08 | Pass | No adult services, sexual exploitation, or adult themes in family-oriented content were found. |
| ADS-PUB-09 | Pass | Domain, publisher identity, metadata, and live `ads.txt` mapping were checked separately. |
| ADS-PUB-10 | N/A | Advertising is disabled, so ads cannot interfere with content or navigation. |
| ADS-PUB-11 | N/A | Advertising is disabled. Indexing and content-quality gates separately prevent unreviewed pages from entering monetizable indexes. |
| ADS-PUB-12 | N/A | Advertising is disabled and no placement plan exists. |
| ADS-PUB-13 | Pass | The site has no politics, health, or climate-claim topic area, and no prohibited claim signals were found. |
| ADS-PUB-14 | Pass | No political, social-issue, or public-concern manipulated media was found. |
| ADS-PUB-15 | Pass | No child-endangerment or sexual-exploitation content signals, upload paths, comments, or public submissions were found. |
| ADS-PUB-16 | N/A | The site does not publish crisis or sensitive-event coverage and advertising is disabled. |

This checkpoint cannot resolve `ADS-PUB-02`; source licences, permissions, or other rights evidence are still required for the quarantined media inventory.
