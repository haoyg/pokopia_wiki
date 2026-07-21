import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Pokopia Portal privacy policy, including information about analytics, advertising, cookies, and contact options.',
  alternates: {
    canonical: canonicalUrl('/privacy-policy'),
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <WebPageJsonLd
        type="WebPage"
        name="Privacy Policy"
        description="Pokopia Portal privacy policy covering analytics, advertising, cookies, Google ad services, user consent, and contact options."
        url="/privacy-policy"
        dateModified="2026-07-21"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' },
        ]}
      />
      <article>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Last updated: July 21, 2026</p>
        <h1 style={{ marginTop: '0.5rem' }}>Privacy Policy</h1>

        <p style={{ marginTop: '1.5rem' }}>
          Pokopia Portal is a gaming information website that publishes guides, wiki pages, tools, and news for Pokopia players. This policy explains what information may be collected when you use this website and how that information is handled.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Information We Collect</h2>
        <p>
          Hosting infrastructure may process basic technical information such as browser type, device type, requested pages, referral URLs, IP-derived approximate region, and security or performance data. Pokopia Portal does not request GPS, Wi-Fi, cell-tower, or other precise-location permission through the website.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Cookies and Advertising</h2>
        <p>
          Pokopia Portal does not currently load Google AdSense, Google Analytics, or other advertising and analytics tags from this website's application code. Advertising and analytics remain disabled until an appropriate consent management implementation is configured and verified.
        </p>
        <p>
          If advertising is enabled later, third-party vendors, including Google, may use cookies, web beacons, IP addresses, and other identifiers to serve and measure ads. This policy will be updated to identify the products and providers actually enabled.
        </p>
        <p>
          Google and its advertising partners may use advertising cookies to enable ad serving, frequency capping, aggregated reporting, fraud prevention, and ad personalization where permitted. You can learn more about how Google uses information from sites and apps that use Google services at <a href="https://policies.google.com/technologies/partner-sites">Google's partner sites policy</a>.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Ad Personalization and Consent</h2>
        <p>
          Before serving personalized Google ads to users in the European Economic Area, the United Kingdom, or Switzerland, Pokopia Portal will configure a Google-certified consent management platform integrated with the IAB Transparency and Consent Framework. The consent message must allow users to consent, decline, manage choices, and later change or withdraw those choices. No such advertising is currently enabled.
        </p>
        <p>
          You can manage or turn off personalized advertising through <a href="https://adssettings.google.com/" rel="noreferrer">Google Ads Settings</a>, browser cookie controls, and industry opt-out tools where available. Disabling cookies may affect analytics, advertising, and some site functionality.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Personal Information and Google Services</h2>
        <p>
          We do not intentionally send personally identifiable information, such as email addresses, phone numbers, or precise account identifiers, to Google ad services in ad requests. Site URLs, page titles, search queries, and contact form messages should not include sensitive personal information.
        </p>
        <p>
          Pokopia Portal does not collect precise GPS location data and does not use Google advertising products to build audience lists based on sensitive categories such as health, financial hardship, ethnicity, religion, political affiliation, sexual behavior, or child-directed activity.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Third-Party Services</h2>
        <p>
          We may use third-party services for hosting, analytics, search visibility, and advertising. These services may process limited technical data according to their own policies. We do not sell personal information directly to advertisers.
        </p>

        <h2 style={{ marginTop: '2rem' }}>User-Provided Information</h2>
        <p>
          If you contact us by email or submit community content in the future, we may receive the information you choose to provide, such as your name, email address, message, build details, or feedback. We use that information to respond, moderate submissions, and improve the site.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Data Retention</h2>
        <p>
          We keep site operation and contact information only as long as reasonably needed for the purposes described above, unless a longer period is required for security, legal, or administrative reasons.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Children's Privacy</h2>
        <p>
          Pokopia Portal is intended for a general gaming audience and is not directed specifically to children. We do not knowingly collect personal information from children. If you believe a child has provided personal information, contact us and we will review the request.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Contact</h2>
        <p>
          For privacy questions, contact us at <a href="mailto:hello@pokopia.cloud">hello@pokopia.cloud</a>.
        </p>
      </article>
    </main>
  )
}
