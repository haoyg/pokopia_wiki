import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Pokopia Portal',
  description: 'Read the Pokopia Portal privacy policy, including information about analytics, advertising, cookies, and contact options.',
  alternates: {
    canonical: canonicalUrl('/privacy-policy'),
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <article>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Last updated: May 23, 2026</p>
        <h1 style={{ marginTop: '0.5rem' }}>Privacy Policy</h1>

        <p style={{ marginTop: '1.5rem' }}>
          Pokopia Portal is a gaming information website that publishes guides, wiki pages, tools, and news for Pokopia players. This policy explains what information may be collected when you use this website and how that information is handled.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Information We Collect</h2>
        <p>
          We may collect basic technical information such as browser type, device type, pages visited, referral URLs, approximate location, and interaction data. This information helps us understand which guides are useful, fix errors, improve site performance, and plan future content.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Cookies and Advertising</h2>
        <p>
          Pokopia Portal may use cookies or similar technologies for analytics, site functionality, and advertising. If Google AdSense or other Google advertising services are enabled, Google may use cookies to serve ads based on visits to this site and other sites. You can manage ad personalization through your Google account settings and browser cookie controls.
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
          Pokopia Portal is intended for a general gaming audience. We do not knowingly collect personal information from children. If you believe a child has provided personal information, contact us and we will review the request.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Contact</h2>
        <p>
          For privacy questions, contact us at <a href="mailto:hello@pokopia.wiki">hello@pokopia.wiki</a>.
        </p>
      </article>
    </main>
  )
}
