import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Copyright and Content Removal',
  description: 'Copyright, trademark, image source, and content removal information for Pokopia Portal.',
  alternates: {
    canonical: canonicalUrl('/copyright'),
  },
}

export default function CopyrightPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <article>
        <h1>Copyright & Content Removal</h1>
        <p style={{ marginTop: '1rem' }}>
          Pokopia Portal respects intellectual property rights. This page explains how we handle trademarks, images, source attribution, and removal requests.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Trademark Ownership</h2>
        <p>
          Pokemon, Pokopia, Nintendo, The Pokemon Company, Game Freak, Creatures Inc., and related names, characters, artwork, logos, and marks belong to their respective owners. Pokopia Portal does not claim ownership of those properties.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Use of Images</h2>
        <p>
          A source label identifies where media was found; it does not establish permission to republish it. Media is displayed only after its commercial, ad-supported reuse basis has been documented as site-owned, licensed, openly licensed, or public domain. Assets without that evidence remain withheld from rendered pages while their rights status is reviewed.
        </p>
        <p>
          Official screenshots, artwork, logos, player submissions, and third-party reposts are not treated as licensed merely because their source is known or credited.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Removal Requests</h2>
        <p>
          If you are a rights holder or authorized representative and believe that content on Pokopia Portal should be corrected, credited differently, or removed, please contact us by email.
        </p>
        <p>
          Email: <a href="mailto:hello@pokopia.cloud">hello@pokopia.cloud</a>
        </p>

        <h2 style={{ marginTop: '2rem' }}>What to Include</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>The URL of the page or image in question.</li>
          <li>A description of the copyrighted or trademarked material.</li>
          <li>Your relationship to the rights holder.</li>
          <li>The requested action, such as removal, correction, or updated attribution.</li>
          <li>A valid contact email for follow-up.</li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>Review Process</h2>
        <p>
          We review reasonable requests and may remove, replace, or update content where appropriate. We may also ask for additional information if a request is incomplete.
        </p>
      </article>
    </main>
  )
}
