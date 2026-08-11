import { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl, BASE_URL } from '@/lib/site'

const updatedAt = '2026-08-11'

const tips = [
  {
    number: '01',
    title: 'Match Weather and Time Before Entering Any Habitat',
    body: 'Every habitat in Pokopia has a specific weather condition and a time window when spawns are most active. Walking into a habitat without checking both means you are working at half efficiency from the first step. If a Pokemon prefers rainy conditions and you enter during clear weather, its spawn rate drops noticeably. The same applies to time-of-day: nocturnal Pokemon are far more likely to appear from dusk onward. Before every session, open the Spawn Tracker or the target habitat page and confirm the current weather and time match your goals. This single check eliminates the most common reason players feel they are "getting unlucky" when the real issue is a simple mismatch.',
    links: [
      { label: 'Spawn Tracker', href: '/tools/spawn-tracker' },
      { label: 'Habitat Planner', href: '/tools/habitat-planner' },
    ],
  },
  {
    number: '02',
    title: 'Build a Balanced Team of 4 Before Chasing Rare Pokemon',
    body: 'It is tempting to pour resources into a single high-rarity Pokemon as soon as it appears, but a team of four well-matched roles will outperform a roster built around one outlier. A balanced team typically covers at least one defender, one damage dealer, one support or healer, and one utility Pokemon that handles movement or terrain. This spread means you can enter harder habitats without burning through healing items on every run. Once the core four are stable and equipped with appropriate recipes, rare and legendary targets become much safer to attempt because the team can sustain itself through longer sessions.',
    links: [
      { label: 'Team Builder', href: '/tools/team-builder' },
      { label: 'Beginner Route', href: '/guides/beginner-route' },
    ],
  },
  {
    number: '03',
    title: 'Prioritize Common and Uncommon Material Drops Over Chasing Legendaries',
    body: 'Common and uncommon materials are the backbone of every sustainable route. They craft into the recipes that keep your team running, they sell for steady income, and they drop frequently enough to build stockpiles without dedicated farming sessions. Legendary Pokemon, by contrast, have extremely low spawn rates, high food costs, and often require specific weather and time conditions that make them impractical as regular farming targets. Spend your early and mid-game sessions gathering the materials that appear on every run. By the time a legendary does spawn, you will have the resources to attempt it without derailing your core progression.',
    links: [
      { label: 'Recipe Calculator', href: '/tools/recipe-calculator' },
      { label: 'Rare Farming Route', href: '/guides/rare-farming-route' },
    ],
  },
  {
    number: '04',
    title: 'Use Favorite Food as the Primary Lure — Do Not Guess',
    body: 'Each Pokemon has a documented favorite food that significantly increases its spawn and encounter rate when used as a lure. Guessing based on type or appearance leads to wasted ingredients and failed spawns. The Pokemon database on this wiki lists favorite food for every entry, along with the habitat and conditions where that Pokemon can appear. Before entering any habitat, check which Pokemon you want to encounter and bring their preferred lure. This is especially important for uncommon and rare tiers, where the difference between using the right food and the wrong food can be the difference between a spawn and an empty session.',
    links: [
      { label: 'Pokemon Database', href: '/wiki/pokemon' },
      { label: 'Recipe List', href: '/guides/complete-recipe-list' },
    ],
  },
  {
    number: '05',
    title: 'Plan Multi-Habitat Routes to Double Material Drop Tables in One Session',
    body: 'Most players enter one habitat, complete a run, and exit to rest. A more efficient approach is to plan a route that covers two or three adjacent habitats in a single session, capitalizing on overlapping material needs. For example, if one habitat drops water-type ingredients and the next drops fire-type ingredients, a team built for both can clear both in one run, effectively doubling the material table you walk away with. Use the Habitat Planner to map adjacent habitats, check their weather and time requirements, and design a loop that minimizes backtracking. This approach works best once your team is stable enough to handle consecutive fights without full recovery between habitats.',
    links: [
      { label: 'Habitat Planner', href: '/tools/habitat-planner' },
      { label: 'Training Grounds', href: '/wiki/habitat/hab020' },
    ],
  },
  {
    number: '06',
    title: 'Keep a Core Team Stable for Five or More Sessions Before Rotating Members',
    body: 'Frequent team rotation is one of the most disruptive habits for long-term progression. Each time you swap a Pokemon into the active roster, you lose accumulated familiarity with its energy curve, its recipe synergy, and its performance under specific habitat conditions. A core team that has run five or more consecutive sessions together will perform more consistently because every member is operating near its ceiling. Rotation should happen only when a specific habitat or target demands a different role, or when a Pokemon has reached a growth plateau and a replacement clearly offers better stats for the current goal.',
    links: [
      { label: 'Team Builder', href: '/tools/team-builder' },
      { label: 'Best Pokemon Guide', href: '/guides/best-pokemon' },
    ],
  },
  {
    number: '07',
    title: 'Use the Spawn Tracker to Pre-Filter Before Entering Habitat',
    body: 'The Spawn Tracker is not just a reference tool — it is a pre-Run filter that saves time and ingredients. Before committing to a habitat, open the Spawn Tracker and enter your current team composition, the current weather, and the current time. The tool will show you which Pokemon are likely to appear, which are unlikely, and which require conditions you have not yet met. Use this output to decide whether the habitat is worth entering now, whether you should wait for a weather or time change, or whether you should bring a different lure. Players who skip this step frequently enter habitats expecting rare spawns that will not appear for another several hours.',
    links: [
      { label: 'Spawn Tracker', href: '/tools/spawn-tracker' },
      { label: 'Forest Valley', href: '/wiki/habitat/hab002' },
    ],
  },
  {
    number: '08',
    title: 'Treat Legendary Pokemon as Last-Tier Farming Targets, Not Early Goals',
    body: 'Legendary Pokemon are called legendary because they appear rarely, demand high resource investment, and often require specific and difficult-to-achieve conditions. Treating them as early-game goals leads to frustration and resource drain. The correct framing is to place legendary farming at the bottom of your priority stack: after your core team is built, after your material economy is stable, and after you have run enough habitat sessions to understand the spawn system. By that point, legendary encounters become exciting bonus content rather than stressful obligations. Chasing them prematurely is the single fastest way to stall progression in Pokopia.',
    links: [
      { label: 'Rare Farming Route', href: '/guides/rare-farming-route' },
      { label: 'Legendary Guide', href: '/guides/how-to-get-legendary-pokemon' },
    ],
  },
]

const faqs = [
  {
    question: 'What is the best starter Pokemon in Pokopia?',
    answer: 'The best starter depends on your preferred role, but most new players benefit from a Pokemon with balanced stats and forgiving energy management. Check the Pokemon database and the best-starter-pokemon guide for current recommendations based on rarity, specialty, and habitat availability.',
  },
  {
    question: 'How do I avoid feeling overwhelmed in Pokopia early game?',
    answer: 'Focus on one habitat at a time, build a stable core team of four before expanding goals, and use the Spawn Tracker to set realistic expectations for each session. Do not chase legendaries or rare Pokemon until your material economy and team are stable.',
  },
  {
    question: 'What is the most efficient way to farm materials in Pokopia?',
    answer: 'Run multi-habitat routes that overlap in material needs, prioritize common and uncommon drops over rare ones, and use the Habitat Planner to design loops that minimize downtime. Bring the correct favorite food lure for your target Pokemon on every run.',
  },
  {
    question: 'How do I build a basic team in Pokopia?',
    answer: 'Start with one defender, one damage dealer, one support Pokemon, and one utility or terrain specialist. Use the Team Builder tool to visualize coverage and adjust roles before entering any habitat. Keep the core four stable for five or more sessions before rotating.',
  },
  {
    question: 'Does weather affect Pokemon spawns in Pokopia?',
    answer: 'Yes. Every Pokemon has preferred weather conditions, and entering a habitat during non-matching weather significantly reduces spawn rates. Always check the Spawn Tracker or the habitat page for current weather conditions before starting a run.',
  },
  {
    question: 'How should I plan my first habitat visits in Pokopia?',
    answer: 'Begin with easy, low-difficulty habitats like Forest Valley, Crystal Lake, or Training Grounds. Learn the food cost, weather check, and route exit pattern in each before moving to harder habitats. Use the Habitat Planner to map conditions and align your team composition before entering.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Tips and Tricks – Complete Guide for New and Intermediate Players | Pokopia Cloud',
  description: 'Practical Pokopia tips and tricks covering team building, material farming, weather matching, habitat planning, spawn tracking, and legendary Pokemon priorities for new and intermediate players.',
  keywords: [
    'pokopia tips and tricks',
    'pokopia tips and tricks reddit',
    'pokopia beginner tips',
    'pokopia guide',
    'pokopia team building',
    'pokopia material farming',
    'pokopia habitat planner',
    'pokopia spawn tracker',
  ],
  openGraph: {
    title: 'Pokopia Tips and Tricks – Complete Guide for New and Intermediate Players',
    description: 'Practical tips and tricks for new and intermediate Pokopia players covering team building, material farming, weather matching, and habitat planning.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Tips and Tricks – Complete Guide',
    description: 'Practical tips and tricks for new and intermediate Pokopia players covering team building, material farming, weather matching, and habitat planning.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/tips-and-tricks'),
  },
}

export default function TipsAndTricksPage() {
  return (
    <main className="page-shell guide-detail-page">
      <ArticleJsonLd
        title="Pokopia Tips and Tricks"
        description="Practical Pokopia tips and tricks covering team building, material farming, weather matching, habitat planning, spawn tracking, and legendary Pokemon priorities for new and intermediate players."
        url="/guides/tips-and-tricks"
        publishedAt={updatedAt}
        modifiedAt={updatedAt}
        type="Guide"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Guides', url: '/guides' },
          { name: 'Tips and Tricks', url: '/guides/tips-and-tricks' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Tips and Tricks Resources"
        description="Planning tools, database pages, and related guides referenced in the Pokopia Tips and Tricks guide."
        url="/guides/tips-and-tricks"
        items={[
          { name: 'Spawn Tracker', url: '/tools/spawn-tracker' },
          { name: 'Habitat Planner', url: '/tools/habitat-planner' },
          { name: 'Team Builder', url: '/tools/team-builder' },
          { name: 'Recipe Calculator', url: '/tools/recipe-calculator' },
          { name: 'Pokemon Database', url: '/wiki/pokemon' },
          { name: 'Habitat Database', url: '/wiki/habitat' },
          { name: 'Beginner Route Guide', url: '/guides/beginner-route' },
          { name: 'Rare Farming Route Guide', url: '/guides/rare-farming-route' },
        ]}
      />
      <FAQJsonLd title="Pokopia Tips and Tricks FAQ" faqs={faqs} />

      <section className="guide-detail-hero topic-hero">
        <span className="panel-kicker">Tips &amp; Tricks</span>
        <h1>Pokopia Tips and Tricks</h1>
        <p>
          This guide covers the practical habits that separate players who progress steadily from players who feel stuck.
          It is written for new players who have finished the tutorial and intermediate players who want to tighten their route efficiency.
          Each tip is designed to be actionable immediately — no legendary prerequisites, no late-game unlocks required.
        </p>
        <div className="topic-hero-actions">
          <Link href="/tools/spawn-tracker">Check spawns</Link>
          <Link href="/tools/habitat-planner">Plan a route</Link>
          <Link href="/tools/team-builder">Build a team</Link>
        </div>
      </section>

      <DataStatus
        status="Editorial guide — confirm mechanics against official sources"
        note="This page organizes editorial gameplay tips and planning advice for Pokopia Portal. Spawn rates, weather effects, material drop tables, recipe mechanics, and legendary spawn conditions should be verified against official Nintendo or Pokopia sources before making resource commitments."
        updatedAt={updatedAt}
        showPolicyLink
      />

      <section className="guide-content-section">
        <div className="guide-answer-panel">
          <h2>What This Guide Covers and Who It Is For</h2>
          <p>
            Pokopia rewards consistency over intensity. Players who run two or three focused habitat sessions per day with the right
            preparations will outpace players who spend hours grinding without checking weather, matching food lures, or building
            stable teams. This guide is organized around eight practical habits that address the most common sources of wasted time
            and resources in early and mid-game sessions. If you are a new player, read Tip 1 through Tip 4 first — those cover the
            foundational checks that affect every single run. If you are an intermediate player looking to optimize, Tip 5 through
            Tip 8 cover route planning, team stability, and spawn tracking at a deeper level.
          </p>
        </div>
      </section>

      {tips.map((tip) => (
        <section key={tip.number} className="guide-route-section">
          <div className="guide-answer-panel">
            <span>{tip.number}</span>
            <h2>{tip.title}</h2>
            <p>{tip.body}</p>
            <div className="topic-hero-actions">
              {tip.links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="guide-content-section">
        <div className="guide-answer-panel">
          <h2>How to Use the Wiki Tools to Support These Tips</h2>
          <p>
            Every tip in this guide connects to one or more tools on this wiki that make the advice actionable rather than theoretical.
            The Spawn Tracker is your pre-run weather and time checker — use it before every habitat entry to confirm your target
            Pokemon are likely to appear. The Habitat Planner lets you map multi-habitat loops and compare weather conditions across
            adjacent zones so you can design efficient sessions rather than entering habitats blind. The Team Builder helps you
            assemble a balanced roster of four and test role coverage before committing to a run. The Recipe Calculator shows you
            which lures and buffs are worth the ingredient cost for your current targets. Bookmark these tools and check them before
            every session. They are the operational layer that turns the principles in this guide into measurable progress.
          </p>
          <div className="topic-hero-actions">
            <Link href="/tools/spawn-tracker">Open Spawn Tracker</Link>
            <Link href="/tools/habitat-planner">Open Habitat Planner</Link>
            <Link href="/tools/team-builder">Open Team Builder</Link>
            <Link href="/tools/recipe-calculator">Open Recipe Calculator</Link>
          </div>
        </div>
      </section>

      <section className="related-content-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Related Content</span>
            <h2>Keep Exploring Pokopia</h2>
          </div>
        </div>
        <div className="related-content-grid">
          <Link href="/wiki/pokemon" className="related-content-card">
            <span>Database</span>
            <strong>Pokemon Database</strong>
            <p>Browse all Pokemon with spawn conditions, favorite foods, drops, and rarity ratings.</p>
          </Link>
          <Link href="/wiki/habitat" className="related-content-card">
            <span>Database</span>
            <strong>Habitat Database</strong>
            <p>Explore habitats by weather, difficulty, unlock condition, and material drops.</p>
          </Link>
          <Link href="/tools/team-builder" className="related-content-card">
            <span>Tool</span>
            <strong>Team Builder</strong>
            <p>Assemble a balanced four-Pokemon roster and check role coverage before a run.</p>
          </Link>
          <Link href="/tools/spawn-tracker" className="related-content-card">
            <span>Tool</span>
            <strong>Spawn Tracker</strong>
            <p>Filter Pokemon by current weather, time of day, and habitat to plan a targeted run.</p>
          </Link>
          <Link href="/guides/beginner-route" className="related-content-card">
            <span>Guide</span>
            <strong>Beginner Route</strong>
            <p>Follow a structured starter path from first habitat entry to stable material farming.</p>
          </Link>
          <Link href="/guides/best-pokemon" className="related-content-card">
            <span>Guide</span>
            <strong>Best Pokemon</strong>
            <p>Current recommended Pokemon picks based on rarity, role coverage, and farming value.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}
