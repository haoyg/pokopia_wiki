# AdSense Restricted Inventory Readiness

Last reviewed: 2026-07-21

This checkpoint follows `ADS-REST-01` through `ADS-REST-08` in the local AdSense site auditor checklist.

## Scope and evidence

The exported site contains gaming information and browser-side planning tools. It does not contain sexual content, graphic or shocking content, real-world weapon sales or construction instructions, tobacco or recreational-drug content, alcohol sales or irresponsible-drinking promotion, gambling, prescription-drug sales, videos, or advertising.

Pokemon move names such as Water Gun, Sludge Bomb, Bullet Seed, and Zap Cannon are fictional gameplay terminology. They are not real-world firearms, explosives, products, sales offers, or assembly instructions.

`scripts/check-publisher-restrictions.js` checks every exported page and blocks newly detected restricted-topic phrases, playable or embedded media, autoplay, advertising containers, video assets, or attempts to enable advertising before a responsive placement review.

## Checklist status

| ID | Status | Evidence or limitation |
| --- | --- | --- |
| ADS-REST-01 | Pass | No sexual content, entertainment, products, supplements, or advice was found. |
| ADS-REST-02 | Pass | No shocking, graphic, disgusting, or prominently obscene content was found. Ordinary fictional game combat terminology is not graphic content. |
| ADS-REST-03 | Pass | No real-world weapons, explosives, sales, acquisition, assembly, or improvement instructions were found. |
| ADS-REST-04 | Pass | No tobacco, recreational-drug, paraphernalia, production, or use content was found. |
| ADS-REST-05 | Pass | No alcohol sales or irresponsible-drinking promotion was found. |
| ADS-REST-06 | Pass | No online gambling or paid game-of-chance content was found. |
| ADS-REST-07 | Pass | No prescription-drug sales, online pharmacy, unapproved drug/supplement, or delisted-app content was found. |
| ADS-REST-08 | N/A | Advertising and video are disabled; there is no ad or video implementation that can obstruct content or controls. A new review is required before either is enabled. |
