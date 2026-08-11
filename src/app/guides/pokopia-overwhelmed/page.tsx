import { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl, BASE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'How to Not Get Overwhelmed in Pokopia – New Player Guide | Pokopia Cloud',
  description: 'Pokopia throws a lot at you. This guide cuts through it: a simple 5-step method to stop feeling lost, build a stable core team, and approach the game as a farming loop rather than a race to catch everything.',
  keywords: [
    'how to not get overwhelmed in pokopia',
    'pokopia beginner guide',
    'pokopia information overload',
    'pokopia getting started',
    'pokopia where to start',
    'pokopia guide',
    'pokopia tips',
    'pokopia new player',
  ],
  openGraph: {
    title: 'How to Not Get Overwhelmed in Pokopia – New Player Guide',
    description: 'A simple 5-step method to stop feeling lost in Pokopia. Build a stable core team, learn one habitat at a time, and treat the game as a farming loop.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Not Get Overwhelmed in Pokopia – New Player Guide',
    description: 'A simple 5-step method to stop feeling lost in Pokopia. Build a stable core team, learn one habitat at a time, and treat the game as a farming loop.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/pokopia-overwhelmed'),
  },
}

const faqs = [
  {
    question: 'Why does Pokopia feel overwhelming?',
    answer: 'Pokopia layers multiple systems at once: Pokemon collection, habitat progression, recipe crafting, weather matching, and role balancing. New players are shown all of it before they have a chance to master any single piece. The solution is to deliberately ignore most of it for the first phase.',
  },
  {
    question: 'Should I try to catch everything?',
    answer: 'No. Chasing a full collection early is the fastest way to burn out. Focus on four Pokemon that cover the basic roles (damage, defense, support, and a utility pick) and stick with them until the team is stable. Expand only after the core is reliable.',
  },
  {
    question: 'How long does it take to get comfortable?',
    answer: 'Most players find their footing within 5 to 10 active sessions. If you follow the One-Thing-First Rule and resist the urge to explore everything at once, you will have a stable team and at least one learned habitat within that window.',
  },
  {
    question: 'What if I pick the wrong starter?',
    answer: 'The starter matters less than most guides suggest. Any starter that fits your preferred role will work. If it is not clicking after a few sessions, swap it out. The real cost of a wrong starter is a few extra spawn runs, not a failed playthrough.',
  },
  {
    question: 'When should I expand to new habitats?',
    answer: 'Expand to a second habitat only after your core team handles the first one predictably. A habitat is considered learned when you can run it without checking the wiki mid-route, food costs feel normal, and weather matches do not surprise you.',
  },
]

const relatedLinks = [
  { label: 'Beginner Route Guide', href: '/guides/beginner-route' },
  { label: 'Best Pokemon to Catch First', href: '/guides/best-pokemon' },
  { label: 'Pokemon Database', href: '/wiki/pokemon' },
  { label: 'Spawn Tracker Tool', href: '/tools/spawn-tracker' },
]

export default function PokopiaOverwhelmedPage() {
  return (
    <main className="page-shell guide-detail-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Guides', url: '/guides' },
          { name: 'How to Not Get Overwhelmed in Pokopia', url: '/guides/pokopia-overwhelmed' },
        ]}
      />
      <ItemListJsonLd
        name="How to Not Get Overwhelmed in Pokopia"
        description="A new player guide that cuts through Pokopia's information overload with a simple 5-step method to build a stable core team."
        url="/guides/pokopia-overwhelmed"
        items={relatedLinks.map((link) => ({ name: link.label, url: link.href }))}
      />
      <FAQJsonLd title="Pokopia Overwhelmed Guide FAQ" faqs={faqs} />

      <section className="guide-detail-hero guide-hero-copy">
        <span className="panel-kicker">New Player Guide</span>
        <h1>How to Not Get Overwhelmed in Pokopia</h1>
        <p>
          Pokopia throws a lot at you. Pokemon to catch, habitats to unlock, recipes to craft, weather to match,
          roles to balance. This guide cuts through it. Follow the One-Thing-First Rule, and you will have
          a stable team and a clear direction before you know it.
        </p>
      </section>

      <DataStatus
        status="Editorial game-context advice"
        note="Guide using editorial game-context advice, not official mechanics documentation."
        updatedAt="2026-08-11"
        showPolicyLink={false}
      />

      <section className="guide-answer-panel">
        <h2>The One-Thing-First Rule</h2>
        <p>
          Do not try to complete the collection. Do not chase rarities. Do not optimize every team slot on week one.
          Your only goal right now: <strong>build a team of four Pokemon that works together</strong>. Everything else is noise.
        </p>
        <p>
          Pokopia rewards consistency, not completeness. A team that can reliably clear one habitat is worth more
          than a half-built roster that tries to cover everything at once.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Step-by-Step: The First Five Sessions</h2>
        <div className="topic-step-grid">
          <article className="topic-step-card">
            <span>01</span>
            <h3>Pick a starter and ignore everything else</h3>
            <p>
              Choose one Pokemon you like. Do not research alternatives, do not look up tier lists, do not ask
              which one is best. Play five sessions with it. Learn its food preferences, its role, and when it
              struggles. That is your anchor.
            </p>
            <Link href="/wiki/pokemon">Browse Pokemon</Link>
          </article>
          <article className="topic-step-card">
            <span>02</span>
            <h3>Learn ONE habitat before the second</h3>
            <p>
              Pick the easiest available habitat and run it until you can do it on autopilot. You should know
              the spawn patterns, the exit timing, and the food cost without checking a guide mid-run. One
              learned habitat is worth three partially explored ones.
            </p>
            <Link href="/wiki/habitat/hab002">Start with Forest Valley</Link>
          </article>
          <article className="topic-step-card">
            <span>03</span>
            <h3>Use the Spawn Tracker instead of guessing</h3>
            <p>
              Do not rely on random encounters to fill your team. Open the Spawn Tracker and look for what actually
              spawns in your current habitat. Catch what is there. Fill gaps intentionally rather than wandering
              hoping something good appears.
            </p>
            <Link href="/tools/spawn-tracker">Open Spawn Tracker</Link>
          </article>
          <article className="topic-step-card">
            <span>04</span>
            <h3>Build balanced before chasing rare</h3>
            <p>
              A balanced team of four common Pokemon will out-perform a fragile roster of two commons and two
              rare spawns that you cannot reliably find. Add one rare only after the core four are stable and
              you have a clear reason to slot it in.
            </p>
            <Link href="/tools/team-builder">Plan a balanced team</Link>
          </article>
          <article className="topic-step-card">
            <span>05</span>
            <h3>Use a checklist to track, not to pressure</h3>
            <p>
              Keep a simple list: core team stable, one habitat learned, food costs predictable, weather matching
              understood. Update it after each session. This is a progress map, not a grading sheet. If something
              is checked off, move on. If not, focus there before anything else.
            </p>
            <Link href="/tools/habitat-planner">Plan your next session</Link>
          </article>
        </div>
      </section>

      <section className="guide-route-section">
        <h2>What to Ignore Entirely (For Now)</h2>
        <div className="topic-step-grid">
          <article className="topic-step-card">
            <span>✕</span>
            <h3>Legendary hunting</h3>
            <p>
              Rare and legendary Pokemon are tempting targets but they have low spawn rates, high food costs,
              and often require a team built specifically to support them. They are a late-phase goal, not
              a first-week objective.
            </p>
          </article>
          <article className="topic-step-card">
            <span>✕</span>
            <h3>Full collection completion</h3>
            <p>
              Pokopia has hundreds of entries. Completing the collection is an endgame loop, not a starting
              point. Treat it as a long-term backdrop, not a checklist item to race through.
            </p>
          </article>
          <article className="topic-step-card">
            <span>✕</span>
            <h3>Optimizing every team slot early</h3>
            <p>
              Perfect team composition is a luxury for players who already know what works. Early on, "good enough"
              and "reliable" beat "optimal" and "fragile." Build the habit first, optimize later.
            </p>
          </article>
        </div>
      </section>

      <section className="guide-answer-panel">
        <h2>What Actually Matters</h2>
        <p>
          Three things drive early progress in Pokopia. Everything else is secondary until these are solid:
        </p>
        <ul>
          <li>
            <strong>Weather matching</strong> — Some Pokemon perform significantly better under specific weather
            conditions. Check the forecast before a serious run and bring Pokemon that match or tolerate it.
          </li>
          <li>
            <strong>Favorite food</strong> — Each Pokemon has a favorite food that improves its performance.
            Knowing which ingredients to bring for your core four is a low-effort, high-return habit to build
            early.
          </li>
          <li>
            <strong>Balanced roles</strong> — A team needs a way to absorb damage, a way to deal it, and a way
            to recover between fights. A Pokemon that can do more than one of these is especially valuable in
            the early phase.
          </li>
        </ul>
      </section>

      <section className="guide-content-section">
        <h2>The Mental Model: Farming Loop, Not a Race</h2>
        <p>
          Treat Pokopia like a farming loop, not a checklist. Each session: arrive at a habitat, run it
          predictably, collect materials, return. The goal is repeatability, not variety. The players who
          burn out are the ones who treat every session as a chance to catch something new. The players who
          stay long-term are the ones who can run the same habitat five times in a row without thinking.
        </p>
        <p>
          Consistency compounds. A team that clears Forest Valley three times per session for a week will
          out-level and out-resource a team that bounced between five different habitats chasing new spawns.
          Pick your loop, own it, then expand when it feels boring — not when it feels hard.
        </p>
      </section>

      <section className="topic-hero">
        <h2>Bookmark These and Check Nothing Else</h2>
        <p>
          Until your core team is stable and you have at least one habitat running on autopilot,
          limit yourself to these four pages. Everything else is a distraction.
        </p>
        <div className="topic-hero-actions">
          <Link href="/guides/beginner-route">Beginner Route Guide</Link>
          <Link href="/guides/best-pokemon">Best Pokemon to Catch First</Link>
          <Link href="/wiki/pokemon">Pokemon Database</Link>
          <Link href="/tools/spawn-tracker">Spawn Tracker</Link>
        </div>
      </section>

      <section className="topic-faq">
        <h2>Frequently Asked Questions</h2>
        <div>
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-content-section">
        <h2>Related Content</h2>
        <div className="related-content-grid">
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="related-content-card">
              <strong>{link.label}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
