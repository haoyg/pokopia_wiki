# AdSense CMP activation checklist

Current repository status: advertising and analytics are disabled. The build fails if known Google advertising or analytics tags are added before CMP configuration is documented.

Before enabling AdSense:

1. In AdSense, open **Privacy & messaging** and create a European regulations message, or select another Google-certified CMP from Google's current certified CMP list.
2. Configure the message for the EEA, the United Kingdom, and Switzerland. It must support IAB TCF v2.3.
3. Give users clear choices to consent, decline, manage options, and later withdraw or change consent.
4. Record the CMP provider and the current Google certification evidence URL in `config/consent-management.json`.
5. Change `status` to `configured`, set `privacy_message_enabled` to `true`, and enable only the advertising or analytics products actually deployed.
6. Add the exact CMP and AdSense code supplied by the selected provider and the AdSense account. Do not reconstruct account-specific tags from examples.
7. Test a fresh browser session for an EEA/UK/Switzerland location. Confirm the CMP appears before advertising storage or personalized-data processing and that declining does not create advertising cookies requiring consent.
8. Test consent withdrawal and save screenshots plus the CMP configuration URL as audit evidence.

Official references:

- https://support.google.com/adsense/answer/13554116?hl=en
- https://support.google.com/adsense/answer/7670013?hl=en
- https://support.google.com/adsense/answer/9804260?hl=en
