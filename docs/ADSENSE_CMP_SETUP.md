# AdSense CMP activation checklist

Current repository status: the built-in Google AdSense Privacy & messaging CMP is configured and owner-tested; advertising and analytics remain disabled.

Evidence recorded on 2026-07-21:

- Coverage: EEA, United Kingdom, and Switzerland.
- Framework: IAB TCF v2.3.
- Controls: consent, decline, manage options, and later withdrawal.
- Tests: fresh-session display and decline-cookie behavior confirmed by the owner.

Before enabling AdSense code:

1. Keep the configured European regulations message published in AdSense **Privacy & messaging**, or document any replacement Google-certified CMP.
2. Configure the message for the EEA, the United Kingdom, and Switzerland. It must support IAB TCF v2.3.
3. Give users clear choices to consent, decline, manage options, and later withdraw or change consent.
4. Record the CMP provider and the current Google certification evidence URL in `config/consent-management.json`.
5. Change `status` to `configured`, set `privacy_message_enabled` to `true`, and enable only the advertising or analytics products actually deployed.
6. Add the exact CMP and AdSense code supplied by the selected provider and the AdSense account. Do not reconstruct account-specific tags from examples.
7. Test a fresh browser session for an EEA/UK/Switzerland location. Confirm the CMP appears before advertising storage or personalized-data processing and that declining does not create advertising cookies requiring consent.
8. Repeat consent withdrawal and cookie tests after deploying the exact AdSense code, and retain screenshots plus the account configuration evidence privately.

Official references:

- https://support.google.com/adsense/answer/13554116?hl=en
- https://support.google.com/adsense/answer/7670013?hl=en
- https://support.google.com/adsense/answer/9804260?hl=en
