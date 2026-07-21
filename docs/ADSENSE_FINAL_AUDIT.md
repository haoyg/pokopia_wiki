# Pokopia Portal AdSense Final Readiness Audit

Audit date: 2026-07-21

Target: `https://pokopia.cloud` and the deployment repository.

Audit mode: normal public gaming-information website; AdSense application is in progress; advertising and analytics are disabled.

Official basis refreshed on 2026-07-21:

- https://support.google.com/adsense/answer/7299563?hl=zh-Hans
- https://support.google.com/adsense/answer/48182?hl=zh-Hans
- https://support.google.com/adsense/answer/10502938?hl=zh-Hans
- https://support.google.com/adsense/answer/10437795?hl=zh-Hans

## Decision

**Not ready**

The deployed site passes the repository, content, navigation, crawler, privacy-disclosure, prohibited-content, and restricted-inventory checks. It must not serve ads yet because AdSense still reports the site as `Getting ready`. Owner traffic confirmations, audience classification, and pre-ad consent management remain unresolved. AdSense approval cannot be guaranteed by this audit.

## Blockers

- `ADS-SITE-01` is `Fail`: the owner reported the AdSense site status as `Getting ready`, not `Ready`. Keep advertising disabled and change the recorded status only after Google marks the site Ready.
- `ADS-ELIG-03` is `Unknown`: the full policy-compliance conclusion cannot pass while invalid-traffic conduct remains unresolved.
- `ADS-PROG-01` is `Unknown`: repository code cannot prove that the owner and all collaborators will avoid own-ad clicks, repeated impressions, bots, or automated traffic. Record the required owner confirmations.

## High Risks

- `ADS-PROG-04` is `Unknown`: no owner evidence confirms that paid-to-click, traffic exchanges, spam promotion, software traffic, and unreviewed traffic partners are prohibited in actual acquisition activity. Record those confirmations and review every traffic partner.
- `ADS-PRIV-04` is `Unknown`: no Google-certified CMP is configured. Ads are disabled, so there is no current consent violation; configure and test the CMP before enabling advertising for EEA, UK, or Swiss users.
- `ADS-PRIV-06` is `Unknown`: the owner has not classified the site as general, teen, child-directed, or mixed audience. Complete the audience review before enabling ads or personalization.

## Medium Risks

No unresolved Medium-severity checklist item was found. Trust pages, navigation, privacy disclosures, canonical URLs, sitemap coverage, content review controls, and `ads.txt` are present.

## Exhaustive Checklist

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| ADS-ELIG-01 | Pass | Owner confirmed that the account holder meets the age requirement. | Keep private age evidence with the account owner. |
| ADS-ELIG-02 | Pass | Owner confirmed an existing AdSense account is used instead of creating a duplicate. | Continue using the existing account. |
| ADS-ELIG-03 | Unknown | Content, code, and media-rights checks pass, but invalid-traffic conduct remains unresolved. | Close ADS-PROG-01 and ADS-PROG-04. |
| ADS-ELIG-04 | N/A | This is an independent Cloudflare-hosted website, not Blogger, YouTube, or another hosted partner. | None. |
| ADS-OWN-01 | Pass | Repository access includes the global Next.js head and deployment output. | Keep the verification path under version control. |
| ADS-OWN-02 | Pass | Owner confirmed control of pokopia.cloud and its Cloudflare configuration. | Retain private domain-control evidence. |
| ADS-OWN-03 | Pass | Static HTML and JavaScript tools build successfully with valid head and body structure. | Re-run the production build before deployment. |
| ADS-SITE-01 | Fail | Owner reported AdSense status Getting ready rather than Ready. | Keep ads disabled until Google marks the site Ready. |
| ADS-SITE-02 | Pass | A live ads.txt verification method is deployed and repository head injection is available. | Use only the verification method requested in the account flow. |
| ADS-TXT-01 | Pass | Live ads.txt authorizes pub-3274781156049995 as DIRECT. | Keep the publisher ID synchronized with the account. |
| ADS-TXT-02 | Pass | ads.txt is published at the domain root with HTTP 200 and text/plain content. | Monitor it after deployments. |
| ADS-CONTENT-01 | Pass | The indexed surface contains original source-aware guides, databases, editorial pages, and tools; unverified entries are quarantined. | Keep unverified entries outside searchable and monetizable surfaces. |
| ADS-CONTENT-02 | Pass | Source-backed pages add commentary, limits, structured data, and tools; unverified media is retired from the deployable public tree. | Preserve source and rights checks. |
| ADS-CONTENT-03 | Pass | All 65 sitemap pages meet rendered depth, headings, review signals, and internal-link thresholds. | Keep the content-quality gate enabled. |
| ADS-CONTENT-04 | Pass | The live homepage and representative sections are complete and reachable; no coming-soon or ad-only surface was found. | Remove unfinished routes from public indexes. |
| ADS-CONTENT-05 | N/A | Advertising, affiliate blocks, sponsored listings, and paid promotion are disabled. | Re-audit content-to-ad ratio before enabling ads. |
| ADS-CONTENT-06 | Pass | Main content is English, an AdSense-supported language. | Keep page language metadata accurate. |
| ADS-CONTENT-07 | N/A | Public comments and user-generated submissions are disabled. | Add moderation controls before enabling UGC. |
| ADS-CONTENT-08 | Pass | Metadata, duplicate-title, indexing, and content-quality gates prevent doorway and keyword-only pages from indexing. | Keep review-required pages noindex. |
| ADS-UX-01 | Pass | Global header and footer navigation is rendered consistently and all exported internal links resolve. | Repeat responsive checks after layout changes. |
| ADS-UX-02 | Pass | Homepage paths, section hubs, search, related content, and breadcrumbs expose clear navigation. | Preserve section and related-content links. |
| ADS-UX-03 | Pass | No fake controls, missing internal targets, misleading redirects, downloads, or ad placeholders were found. | Keep the navigation gate enabled. |
| ADS-UX-04 | Pass | No scripted redirects, downloads, external scripts, malware-like flows, popups, or popunders were found. | Review every future third-party script. |
| ADS-UX-05 | Pass | About, Contact, Privacy, Terms, Disclaimer, Copyright, editorial, source, and correction pages are live and linked. | Keep trust pages current. |
| ADS-UX-06 | Pass | No ad-like placeholders or advertising layout is present before approval. | Perform a new visual separation review before adding ads. |
| ADS-CRAWL-01 | Pass | Live homepage and representative pages respond over HTTPS; canonical sitemap pages have exported HTML. | Monitor 4xx and 5xx responses. |
| ADS-CRAWL-02 | Pass | robots.txt explicitly allows Mediapartners-Google and there is no login wall. | Preserve the explicit allow rule. |
| ADS-CRAWL-03 | Pass | Public content is available through GET and no ad-bearing POST-only route exists. | Do not place ads on POST-only result screens. |
| ADS-CRAWL-04 | Pass | Canonical pages use only the stable trailing-slash redirect and have no cookie or session redirect dependency. | Avoid adding fragile redirect chains. |
| ADS-CRAWL-05 | Pass | Canonical and sitemap URLs contain no session, user, email, token, query, or fragment state. | Keep URLs stable and canonical. |
| ADS-CRAWL-06 | Pass | pokopia.cloud resolves with valid HTTPS and Cloudflare returns successful live responses. | Continue DNS, TLS, and uptime monitoring. |
| ADS-CRAWL-07 | Pass | Live robots.txt advertises a sitemap containing 65 stable URLs with internal-link coverage. | Submit and monitor the canonical sitemap. |
| ADS-PROG-01 | Unknown | Code contains no automation, but owner conduct and traffic-generation behavior cannot be proven from the repository. | Confirm no own-ad clicks, repeated impressions, bots, or artificial traffic. |
| ADS-PROG-02 | Pass | No copy encourages visitors to click, view, or refresh ads. | Keep click-encouragement checks enabled. |
| ADS-PROG-03 | N/A | No ads or ad labels are rendered. | Use neutral labels and clear separation when ads are added. |
| ADS-PROG-04 | Unknown | Paid, partner, spam, exchange, and software-driven traffic sources have not been owner-confirmed. | Record prohibited-source confirmations and review traffic partners. |
| ADS-PROG-05 | N/A | No AdSense code is active or modified. | Re-audit exact account code before activation. |
| ADS-PROG-06 | N/A | No ad placement exists in software, email, private screens, popups, frames, or non-content pages. | Limit any future placement to reviewed content pages. |
| ADS-PROG-07 | N/A | The audited target is a normal website, not an app WebView. | Run a WebView-specific audit if embedded in an app. |
| ADS-PUB-01 | Pass | No illegal content, illegal-activity promotion, commerce, or published unresolved-rights media was found. | Keep prohibited-content and media gates enabled. |
| ADS-PUB-02 | Pass | 149 records were retired from publication; after deployment, all 81 former public files across 27 content paths returned HTTP 404. | Keep files quarantined unless commercial reuse rights are documented. |
| ADS-PUB-03 | Pass | No hate, harassment, threat, self-harm, terrorism, cartel, or extortion content signal was found. | Re-run policy review for new topic areas or UGC. |
| ADS-PUB-04 | Pass | No animal-cruelty promotion or endangered-species commerce was found. | Re-audit if commerce or UGC is introduced. |
| ADS-PUB-05 | Pass | Sitewide publisher identity, unofficial status, non-affiliation, source labels, and purpose disclosures are live. | Preserve visible disclosures. |
| ADS-PUB-06 | Pass | No phishing, credential collection, deceptive offer, payment flow, or external script was found. | Review new forms and services before deployment. |
| ADS-PUB-07 | Pass | No hacking, cracking, surveillance, fake-document, cheating, or evasion instructions were found. | Keep unsafe activity excluded. |
| ADS-PUB-08 | Pass | No adult services, sexual exploitation, or adult themes in family-oriented content were found. | Apply the same rule to future UGC. |
| ADS-PUB-09 | Pass | Domain, publisher metadata, account mapping, and live ads.txt seller data are consistent. | Update all surfaces together if publisher details change. |
| ADS-PUB-10 | N/A | Advertising is disabled, so ads cannot overlap or trap interaction. | Complete responsive placement testing before enabling ads. |
| ADS-PUB-11 | N/A | Advertising is disabled; separate gates control low-value and unreviewed indexed content. | Define an explicit ad-eligible route allowlist before activation. |
| ADS-PUB-12 | N/A | Advertising is disabled and there is no background or off-screen placement. | Review responsive and lazy-loaded placements before activation. |
| ADS-PUB-13 | Pass | No election, harmful-health, or climate-consensus claim topic area or prohibited claim signal was found. | Run specialist review if those topics are introduced. |
| ADS-PUB-14 | Pass | No political, social-issue, or public-concern manipulated media was found. | Review AI media if public-concern topics are introduced. |
| ADS-PUB-15 | Pass | No child-endangerment content, uploads, comments, or public submissions were found. | Treat any future signal as an immediate blocker. |
| ADS-PUB-16 | N/A | The site does not publish crisis or sensitive-event coverage and advertising is disabled. | Re-audit before monetizing sensitive-event coverage. |
| ADS-REST-01 | Pass | No sexual content, entertainment, products, supplements, or advice was found. | Keep restricted-topic checks enabled. |
| ADS-REST-02 | Pass | No shocking, graphic, disgusting, or prominently obscene content was found. | Review new images and UGC. |
| ADS-REST-03 | Pass | No real-world weapon or explosive sales, acquisition, assembly, or improvement instructions were found. | Continue distinguishing fictional move names from real instructions. |
| ADS-REST-04 | Pass | No tobacco, recreational-drug, paraphernalia, production, or use content was found. | Re-audit new commerce or health topics. |
| ADS-REST-05 | Pass | No alcohol sales or irresponsible-drinking promotion was found. | Re-audit new commerce content. |
| ADS-REST-06 | Pass | No online gambling or paid game-of-chance content was found. | Re-audit reward or chance-based monetization features. |
| ADS-REST-07 | Pass | No prescription-drug sales, online pharmacy, unapproved product, or delisted-app content was found. | Re-audit health and app promotion topics. |
| ADS-REST-08 | N/A | Advertising and video are disabled, so no ad or video control can be obstructed. | Complete placement review before enabling either feature. |
| ADS-PRIV-01 | Pass | The live Privacy Policy discloses hosting data and future Google product data collection and use. | Update it to match every product actually enabled. |
| ADS-PRIV-02 | Pass | The policy discloses third-party cookies, web beacons, IP addresses, and other identifiers. | Preserve the disclosure when enabling ads. |
| ADS-PRIV-03 | Pass | No ad or analytics code sends PII to Google, and the policy prohibits intentional PII transmission. | Review URLs and data layers before activation. |
| ADS-PRIV-04 | Unknown | Advertising is disabled, but no Google-certified CMP is configured or tested for EEA, UK, and Swiss traffic. | Configure and test a certified CMP before enabling ads. |
| ADS-PRIV-05 | N/A | No precise GPS, Wi-Fi, or cell-tower location data is collected. | Re-audit before adding precise location. |
| ADS-PRIV-06 | Unknown | Audience classification remains owner-confirmation-required. | Classify the site and apply child or teen treatment where required. |
| ADS-PRIV-07 | Pass | No application code sets, modifies, intercepts, or deletes cookies on Google domains. | Re-run the source check after adding ad code. |
| ADS-PRIV-08 | N/A | Personalized ads, remarketing, and sensitive audience lists are disabled. | Keep them disabled for restricted audiences and data. |
| ADS-PRIV-09 | N/A | The site does not advertise or retarget housing, employment, or credit products. | Re-audit before entering those categories. |
| ADS-PRIV-10 | N/A | Personalized advertising and audience-data use are disabled. | Confirm data rights and controls before personalization. |

## Completeness Check

- Unique requirement IDs in reference: `73`
- Checklist rows in report: `73`
- Missing IDs: `none`
- Duplicate IDs in checklist: `none`
