import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Pokopia Portal',
  description: 'Contact Pokopia Portal for corrections, guide suggestions, advertising questions, and community build feedback.',
  alternates: {
    canonical: canonicalUrl('/contact'),
  },
}

export default function ContactPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <article>
        <h1>Contact Pokopia Portal</h1>
        <p style={{ marginTop: '1rem' }}>
          We welcome corrections, guide suggestions, build submissions, partnership questions, and feedback about the site.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Email</h2>
        <p>
          Send messages to <a href="mailto:hello@pokopia.wiki">hello@pokopia.wiki</a>. Please include the page URL when reporting outdated data, missing internal links, or a guide that needs review.
        </p>

        <h2 style={{ marginTop: '2rem' }}>What to Send</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>Corrections for Pokemon, habitat, recipe, guide, or news pages.</li>
          <li>Suggestions for new long-tail guides and player questions.</li>
          <li>Community builds with team members, recipes, habitats, and playstyle notes.</li>
          <li>Advertising, privacy, or site policy questions.</li>
          <li>Copyright, trademark, image source, or content removal requests.</li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>Rights and Removal Requests</h2>
        <p>
          If you are contacting us about copyrighted material, trademarks, screenshots, or image attribution, please include the page URL, the content in question, your relationship to the rights holder, and the action requested. See our <a href="/copyright">copyright and content removal page</a> for details.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Response Time</h2>
        <p>
          We aim to review useful corrections and content suggestions as soon as possible. Complex guide updates may take longer because they need editorial review before publication.
        </p>
      </article>
    </main>
  )
}
