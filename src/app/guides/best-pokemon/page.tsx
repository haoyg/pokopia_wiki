import { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl, BASE_URL } from '@/lib/site'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'

export const metadata: Metadata = {
  title: 'Best Starter Pokemon in Pokopia (2026 Ranking) – All Picks Ranked | Pokopia Cloud',
  description:
    'Find the best starter Pokemon in Pokopia ranked by role fit, route conditions, and food cost. Plus the best Pokemon for every role — attacker, support, tank, speedster — and a team-building framework built around route fit over rarity.',
  keywords: [
    'pokopia best pokemon',
    'best pokemon in pokopia',
    'what is the best pokemon to use in pokopia',
    'pokopia best starter',
    'pokopia best attacker',
    'pokopia best team',
    'pokopia legendary pokemon',
    'pokopia rarity tier',
    'pokopia starter guide',
    'pokopia role tier list',
  ],
  openGraph: {
    title: 'Pokopia Best Pokemon – Top Picks for Every Role and Build',
    description:
      'Attacker, support, tank, and speedster picks ranked by route fit. Plus best starter, rarity tier breakdown, and a balanced team framework.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Best Pokemon – Top Picks for Every Role and Build',
    description:
      'Attacker, support, tank, and speedster picks ranked by route fit. Plus best starter, rarity tier breakdown, and a balanced team framework.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/best-pokemon'),
  },
}

const updatedAt = '2026-08-10'

const bestPokemonFaqs = [
  {
    question: 'Is rarity everything in Pokopia?',
    answer:
      'No. Rarity influences raw stat potential, but route fit matters more for practical play. A common Pokemon with skills matched to the habitat, weather, and timing window will outperform a rare Pokemon dragged into the wrong route. Use rarity as a ceiling indicator, not a replacement for route-level evaluation.',
  },
  {
    question: 'What is the best starter Pokemon in Pokopia?',
    answer:
      'Bulbin and Aquap are the two most forgiving starter choices. Bulbin (Grass/Defender) gives new players a safe Forest Valley entry with Protect and Vine Whip to learn route pacing. Aquap (Water/Support) teaches rain support and Crystal Lake basics. Pikafire is more rewarding once a player understands Volcanic Cave timing and has Apple to spend on confirmed openers.',
  },
  {
    question: 'Which Pokemon is best for new players?',
    answer:
      'New players benefit most from Bulbin or Aquap because both have forgiving spawn conditions (Any weather or Any time), inexpensive food costs, and straightforward roles that do not demand precise timing. Both appear early in the habitat progression and teach core route concepts before the player faces harder habitat gates.',
  },
  {
    question: 'How do I know if my Pokemon is good?',
    answer:
      'Check whether the Pokemon's specialty, skills, and preferred food match the habitat you plan to run. A good Pokemon for your route will have at least two of three things: a relevant specialty role, skills that control or clear the habitat's dominant enemy pattern, and a food cost you can sustain across repeated runs. If all three align, the Pokemon is worth investing in.',
  },
  {
    question: 'Can I use common Pokemon in late-game routes?',
    answer:
      'Yes, if the route conditions align with the Pokemon's strengths. Zaprat (common Electric/Speedster) remains a strong Windmill Plains scout at any stage because speed and interrupt timing do not scale with rarity. Check whether a common Pokemon fills a specific role (interrupts, weather setup, material drops) better than a rarer alternative before committing the habitat slot.',
  },
]

// Pokemon IDs for role sections
const attackerIds = ['pkm001', 'pkm003'] // Pikafire, Charmuddy
const supportIds = ['pkm004'] // Aquap
const tankIds = ['pkm007'] // Flamexor (legendary tank)
const speedsterIds = ['pkm005'] // Zaprat
const starterIds = ['pkm002', 'pkm004', 'pkm001'] // Bulbin, Aquap, Pikafire
const commonBest = ['pkm002'] // Bulbin
const uncommonBest = ['pkm003', 'pkm005'] // Charmuddy, Zaprat
const rareBest = ['pkm001', 'pkm006'] // Pikafire, Leafon
const legendaryBest = ['pkm007'] // Flamexor

const relatedContentIds = [
  'pkm001', 'pkm002', 'pkm003', 'pkm004', 'pkm005', 'pkm006', 'pkm007',
]

function byId<T extends { id: string }>(items: T[], ids: string[]) {
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as T[]
}

export default function BestPokemonPage() {
  const attackers = byId(pokemonData, attackerIds)
  const supports = byId(pokemonData, supportIds)
  const tanks = byId(pokemonData, tankIds)
  const speedsters = byId(pokemonData, speedsterIds)
  const starters = byId(pokemonData, starterIds)
  const commonPicks = byId(pokemonData, commonBest)
  const uncommonPicks = byId(pokemonData, uncommonBest)
  const rarePicks = byId(pokemonData, rareBest)
  const legendaryPicks = byId(pokemonData, legendaryBest)
  const relatedPokemon = byId(pokemonData, relatedContentIds)

  return (
    <main className="page-shell guide-detail-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Best Pokemon', url: '/guides/best-pokemon' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Best Pokemon Guide"
        description="Top Pokemon picks for every role, rarity tier, and team slot in Pokopia."
        url="/guides/best-pokemon"
        items={[
          { name: 'Best Starters', url: '/guides/best-pokemon#best-starters' },
          { name: 'Best by Role', url: '/guides/best-pokemon#best-by-role' },
          { name: 'Best by Rarity', url: '/guides/best-pokemon#best-by-rarity' },
          { name: 'Best Legendary', url: '/guides/best-pokemon#best-legendary' },
          { name: 'Evaluate Your Own Picks', url: '/guides/best-pokemon#evaluate' },
          { name: 'Build a Balanced Team', url: '/guides/best-pokemon#team-building' },
        ]}
      />
      <FAQJsonLd title="Pokopia Best Pokemon FAQ" faqs={bestPokemonFaqs} />

      <section className="guide-detail-hero topic-hero">
        <span className="panel-kicker">Best Pokemon</span>
        <h1>Best Starter Pokemon in Pokopia (2026 Ranking)</h1>
        <p>
          Rarity does not decide winners in Pokopia. Route fit does. This guide picks the best Pokemon for
          each role, rarity tier, and build path — grounded in habitat conditions, food costs, and the
          kind of sustained route performance that actually holds up after the first few runs.
        </p>
        <div className="topic-hero-actions">
          <Link href="/wiki/pokemon">Pokemon database</Link>
          <Link href="/tools/team-builder">Build a team</Link>
          <Link href="/guides/beginner-route">Beginner route</Link>
        </div>
      </section>

      <DataStatus
        status="Editorial recommendations"
        note="Editorial recommendations — verify against your specific route conditions. All picks are evaluated against habitat data, spawn conditions, and role fit. Confirm weather, time, and food costs against your current game version before committing resources."
        updatedAt={updatedAt}
        showPolicyLink
      />

      {/* Introduction */}
      <section className="guide-content-section" id="introduction">
        <div className="guide-hero-copy">
          <h2>What Makes a Pokemon &quot;Best&quot; in Pokopia</h2>
          <p>
            The instinct is to equate rarity with power and reach for legendary or rare Pokemon as soon as
            they appear. That instinct is wrong more often than it is right in Pokopia. The game is
            structured around habitat routing — running specific areas under specific weather and time
            conditions to collect materials, complete route goals, and build a sustainable progression
            loop. A Pokemon that fits that loop precisely will outperform a higher-rarity option that fights
            against the route conditions.
          </p>
          <p>
            When we say &quot;best&quot; in this guide, we mean best for a given role in a route context.
            Best attacker does not mean highest damage numbers in isolation. It means the attacker whose
            skill set, food cost, and spawn conditions align with a habitat where you need damage solved.
            Bulbin is the best common Defender not because it has the highest defensive stats, but because
            Forest Valley during Any / Cloudy conditions makes its Vine Whip and Protect timing predictable
            and cheap. That predictability is the actual value.
          </p>
          <p>
            This best Pokemon guide is organized so you can read each section with your current route in mind. If you are running Forest Valley, Bulbin is
            probably the right fit. If you are building toward Volcanic Cave for Fire materials, Pikafire
            becomes the better attacker even though it costs Apple and demands a confirmed Thunderbolt
            opener. Route stage matters as much as role fit.
          </p>
        </div>
      </section>

      {/* Best Starters */}
      <section className="guide-route-section" id="best-starters">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Starter Picks</span>
            <h2>Best Starter Pokemon in Pokopia</h2>
          </div>
          <Link href="/wiki/pokemon">All Pokemon</Link>
        </div>
        <div className="guide-answer-panel">
          <p>
            The three best starters are Bulbin for defensive stability, Aquap for rain support and Crystal
            Lake onboarding, and Pikafire for players who want fire pressure early and are willing to spend
            Apple on confirmed Volcanic Cave openers. Each covers a different route philosophy, and all
            three are worth understanding even if you pick only one as your primary starter.
          </p>
        </div>
        <div className="pokemon-team-grid">
          {starters.map((pokemon) => (
            <Link
              key={pokemon.id}
              href={`/wiki/pokemon/${pokemon.id}`}
              className="pokemon-team-card"
            >
              <span className="pokemon-quick-facts">
                {pokemon.rarity} · {pokemon.specialty}
              </span>
              <strong>{pokemon.name}</strong>
              <p>{pokemon.type}</p>
              <small>
                {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
              </small>
            </Link>
          ))}
        </div>
        <div className="guide-hero-copy">
          <h3>Bulbin – The Safe Defender Route</h3>
          <p>
            Bulbin is the most forgiving starter in Pokopia for players entering Forest Valley. Its Grass
            typing and Defender specialty give it neutral matchups against the route's dominant early
            enemies. Vine Whip handles the first controlled clear, and Protect teaches timing — when to
            hold a turn, when to push damage, and when to exit before the route becomes unpredictable.
            The food cost (Leaf) is among the cheapest in the game, making repeated Forest Valley runs
            sustainable for new accounts that cannot yet afford rare recipe ingredients. Bulbin stays
            relevant even after you move past the starter phase because its material drops (Leaf and Grass
            Fiber) remain useful for early crafting paths.
          </p>
          <h3>Aquap – Rain Support Lesson</h3>
          <p>
            Aquap is the support starter that teaches Crystal Lake routing before you commit to harder
            water habitats. Its Water / Support role means it does not front-load damage — it sets up
            Rain Dance for the team and uses Water Gun and Bubble to control the opening pattern. The Any
            / Rain spawn window is wide enough that new players can find it without complex timing
            research. Golden Fish is a moderate food cost compared to Leaf, but the Rain Dance
            payoff changes how the entire Crystal Lake route flows, giving you a second Pokemon that
            understands weather before you face habitats where weather is the entire challenge.
          </p>
          <h3>Pikafire – Early Fire Pressure</h3>
          <p>
            Pikafire is the highest-ceiling starter and the worst choice for true beginners. Its
            Fire/Electric typing and Attacker specialty reward players who already know how to confirm a
            Volcanic Cave opener before spending Apple. Thunderbolt opens cleanly under Day / Sunny
            conditions, Quick Attack finishes weakened targets, and the rare Fire Stone and Thunder Stone
            drops support a burst-focused build path. If you are confident in your route scouting and can
            sustain Apple costs, Pikafire is the fastest early-progress pick. If you are still learning
            habitat pacing, Bulbin or Aquap will teach you more per run.
          </p>
        </div>
      </section>

      {/* Best by Role */}
      <section className="guide-route-section" id="best-by-role">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Role Rankings</span>
            <h2>Best Pokemon for Each Role</h2>
          </div>
          <Link href="/wiki/pokemon">Pokemon database</Link>
        </div>
        <div className="guide-answer-panel">
          <p>
            Each role — Attacker, Support, Tank, and Speedster — has one or two picks that stand out
            from the current data because their skill sets, spawn conditions, and food costs align
            cleanly with habitats where that role is most needed. These are not the only viable picks,
            but they are the ones most consistently supported by route-level data.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Attacker</h3>
          <div className="pokemon-team-grid">
            {attackers.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Pikafire earns the top attacker slot because its Fire/Electric coverage handles the two most
            common route resistance types (Water and Flying) while its Thunderbolt and Quick Attack
            combination delivers both burst and finishing speed. The key is confirming the Volcanic
            Cave opener before spending Apple — once Thunderbolt lands cleanly, the rest of the run
            follows a predictable damage sequence. Charmuddy is the secondary attacker pick for players
            who need Ash farming and Fire Spin control during Night / Clear routes, with a lower
            ceiling than Pikafire but also a lower food cost floor.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Support</h3>
          <div className="pokemon-team-grid">
            {supports.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Aquap is the standout support pick because Rain Dance changes the entire Crystal Lake
            routing logic. Water Gun opens cleanly, Bubble confirms pacing, and Aqua Jet gives the
            support role a clean exit tool when the route needs to end quickly. The Any / Rain spawn
            window means you can plan around it without precise timing research, and the Water Stone
            and Pearl drops cover two of the most common early crafting bottlenecks. Pair it with any
            attacker that benefits from rain, and the team immediately gains a weather pivot that most
            habitats cannot counter.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Tank / Defender</h3>
          <div className="pokemon-team-grid">
            {tanks.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Flamexor is the legendary tank pick that earns its slot through Iron Defense stacking and
            Fire/Steel typing giving it matchup coverage most defenders cannot claim. Flame Body
            punishes contact attackers, Stealth Rock sets entry hazard pressure, and Fire Blast delivers
            enough damage that the tank role does not become purely passive. The food cost (Iron Ore)
            is high, and the Night / Clear Volcanic Cave window is restrictive, which is why it ranks
            as the best tank specifically for players who have reached that habitat gate. For earlier
            routes, Bulbin remains the practical defender choice.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Speedster</h3>
          <div className="pokemon-team-grid">
            {speedsters.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Zaprat is the clearest speedster pick in the current data. Electric typing with Spark
            interrupts, Quick Attack confirms, and Thunder Wave creates team-wide speed advantage.
            The Morning / Windy Windmill Plains window is narrow but consistent, and the Cheese food
            cost is manageable for repeated speed runs. The tradeoff is fragility — Zaprat cannot
            absorb repeated hits and needs a sturdy partner to cover the routes where the scout plan
            does not hold. Use it to open faster routes, not to force a speed build into habitats
            where matchup trading favors the enemy.
          </p>
        </div>
      </section>

      {/* Best by Rarity */}
      <section className="guide-route-section" id="best-by-rarity">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Rarity Tiers</span>
            <h2>Best Pokemon by Rarity Tier</h2>
          </div>
          <Link href="/wiki/pokemon">All Pokemon</Link>
        </div>
        <div className="guide-answer-panel">
          <p>
            Rarity tiers are useful for setting expectations about food costs, spawn frequency, and
            material drop value — but they do not tell the whole story. Each tier has picks that
            outperform their rarity classification within specific route contexts.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Common Pokemon</h3>
          <div className="pokemon-team-grid">
            {commonPicks.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Bulbin is the best common Pokemon in the current data because its Forest Valley role as a
            safe Defender matches exactly what new accounts need. The Any / Cloudy spawn window is the
            widest of any common pick, Leaf is the cheapest food in the game, and the Vine Whip /
            Protect combination teaches route pacing without demanding precise execution. Common Pokemon
            are not meant to carry late-game habitats, but Bulbin holds its utility long past the
            starter phase because Grass Fiber remains a crafting basic that even advanced builds still
            require.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Uncommon Pokemon</h3>
          <div className="pokemon-team-grid">
            {uncommonPicks.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Charmuddy and Zaprat split the uncommon recommendation depending on whether you need fire
            damage or electric speed. Charmuddy is the Ash farmer for Night / Clear Volcanic Cave runs,
            using Fire Spin to control enemies and Flamethrower as the main damage source. Its Honey food
            cost is moderate, and the night window gives it a route slot that does not compete with
            Pikafire's daytime Volcanic Cave build. Zaprat fills the speedster slot at uncommon rarity,
            delivering Morning / Windy Windmill Plains interrupts with Spark and Quick Attack that most
            uncommon attackers cannot match for opening speed. Neither is a generalist — both are
            specialists whose value is locked to their specific habitat and time window.
          </p>
        </div>

        <div className="guide-content-section">
          <h3>Best Rare Pokemon</h3>
          <div className="pokemon-team-grid">
            {rarePicks.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="pokemon-team-card"
              >
                <span className="pokemon-quick-facts">
                  {pokemon.rarity} · {pokemon.specialty}
                </span>
                <strong>{pokemon.name}</strong>
                <p>{pokemon.type}</p>
                <small>
                  {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
                </small>
              </Link>
            ))}
          </div>
          <p>
            Pikafire and Leafon represent the two strongest rare picks in the current data. Pikafire
            covers the Fire/Electric attacker role with Thunderbolt and Quick Attack that most rare
            attackers cannot replicate at any rarity tier. Its Day / Sunny Volcanic Cave window is
            demanding (Apple food cost, clear-weather dependency) but the damage ceiling justifies the
            investment for players building toward fire-side material progression. Leafon covers the
            foggy Forest Valley assassin role — Night / Foggy conditions, Poison Powder status setup,
            Sludge Bomb payoff — and drops Poison Stone and Leaf Stone for builds that need either
            material path. The rare tier is where Pokemon start having real build identity, and both
            of these are worth the food and habitat commitment once your route is confirmed.
          </p>
        </div>
      </section>

      {/* Best Legendary */}
      <section className="guide-route-section" id="best-legendary">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Legendary Tier</span>
            <h2>Best Legendary Pokemon</h2>
          </div>
          <Link href="/wiki/pokemon">Pokemon database</Link>
        </div>
        <div className="guide-answer-panel">
          <p>
            Legendary Pokemon are worth targeting last, not first. The food costs are high, the spawn
            windows are restrictive, and the habitat gates that unlock them are post-beginner content
            by design. The current data shows Flamexor as the most practical legendary to pursue, with
            a route that rewards patience more than it punishes early mistakes.
          </p>
        </div>
        <div className="pokemon-team-grid">
          {legendaryPicks.map((pokemon) => (
            <Link
              key={pokemon.id}
              href={`/wiki/pokemon/${pokemon.id}`}
              className="pokemon-team-card"
            >
              <span className="pokemon-quick-facts">
                {pokemon.rarity} · {pokemon.specialty}
              </span>
              <strong>{pokemon.name}</strong>
              <p>{pokemon.type}</p>
              <small>
                {pokemon.spawn_time} / {pokemon.weather} / {pokemon.favorite_food}
              </small>
            </Link>
          ))}
        </div>
        <div className="guide-hero-copy">
          <h3>Why Target Legendary Last</h3>
          <p>
            Flamexor is the best legendary to build toward, but it should not be your first or even
            second habitat target. The Iron Ore food cost is expensive relative to early crafting
            budgets, the Night / Clear Volcanic Cave window competes with Charmuddy's route, and the
            Tank role requires a supporting team that can absorb pressure while Flamexor stacks Iron
            Defense. Chasing Flamexor before your route is stable burns resources on a Pokemon that
            cannot carry a team that lacks the basics.
          </p>
          <p>
            The case for targeting legendary at all is Metal Coat and Legendary Scale — both are
            material sinks that power mid-to-late game crafting paths that common and uncommon Pokemon
            cannot access. If your build roadmap has a Metal Coat or Legendary Scale requirement,
            Flamexor is the route. If you are still filling basic crafting gaps, legendary should wait.
            Once your team has one reliable attacker, one support, and one defender that handle their
            respective habitats consistently, Flamexor becomes the add-on that raises the team's
            ceiling rather than the rescue that compensates for gaps.
          </p>
        </div>
      </section>

      {/* How to Evaluate */}
      <section className="guide-content-section" id="evaluate">
        <div className="guide-hero-copy">
          <h2>How to Evaluate &quot;Best&quot; for Your Own Route</h2>
          <p>
            The framework above gives you editorial recommendations grounded in the current habitat
            data, but your route is specific to your build path, current material needs, and the
            habitats you have unlocked. Use this three-question check before committing to any Pokemon
            recommendation — whether from this guide or from any other source.
          </p>
          <p>
            First, does the Pokemon's specialty match the role your route needs filled right now? If
            you are early and still clearing Forest Valley basics, Bulbin's Defender specialty is
            relevant. If you are past that stage and need Volcanic Cave burst damage, Pikafire's
            Attacker specialty is the relevant match. Role fit is not about having every role filled
            — it is about filling the role that your current route gap actually requires.
          </p>
          <p>
            Second, do the spawn conditions (time and weather) match a habitat you can run consistently?
            A Pokemon with perfect role fit is useless if its spawn window requires conditions you
            cannot reliably find. Check whether the habitat that matches your route also matches the
            Pokemon's spawn window. Zaprat needs Morning / Windy Windmill Plains. If your schedule or
            the current weather pattern makes that unreliable, Zaprat is not your best pick regardless
            of its Speedster credentials.
          </p>
          <p>
            Third, can you sustain the food cost across repeated runs? Food is the recurring resource
            budget in Pokopia. Leaf for Bulbin is cheap and forgiving. Apple for Pikafire is expensive
            and demands confirmed openers before each spend. Iron Ore for Flamexor is a significant
            commitment that requires a Volcanic Cave material loop to sustain. Know your food production
            rate before picking a Pokemon whose food cost exceeds what your current route can replenish.
          </p>
          <p>
            If all three answers are yes — role fit, reliable spawn conditions, sustainable food cost —
            the Pokemon is worth building around. If any one of the three is uncertain, dig deeper
            before committing the habitat slot.
          </p>
        </div>
      </section>

      {/* Team Building */}
      <section className="guide-route-section" id="team-building">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Team Framework</span>
            <h2>Build a Balanced Team From Best Picks</h2>
          </div>
          <Link href="/tools/team-builder">Team Builder tool</Link>
        </div>
        <div className="guide-answer-panel">
          <p>
            A balanced Pokopia team has four slots filled by specialists who each cover a distinct
            route need. Using the best-in-role picks from this guide, here is how those four slots map
            to a starter-friendly balanced team and how the composition shifts as you progress toward
            late-game habitats.
          </p>
        </div>
        <div className="guide-hero-copy">
          <h3>Starter Balanced Team (Four Slots)</h3>
          <p>
            Slot one: Bulbin as the Defender. Forest Valley Any / Cloudy stability, Protect timing
            lessons, Leaf food cost that new accounts can sustain. This is the safety net that lets
            the rest of the team push without needing to retreat early. Slot two: Aquap as the Support.
            Crystal Lake Any / Rain weather setup, Rain Dance pivot, Pearl and Water Stone material
            drops. The weather advantage this provides to any attacker on the team is disproportionate
            to its food cost. Slot three: Pikafire or Charmuddy as the Attacker depending on whether
            you have confirmed Volcanic Cave openers (Pikafire with Apple) or want a cheaper Night /
            Clear fire route (Charmuddy with Honey). Slot four: Zaprat as the Speedster for Windmill
            Plains Morning / Windy scouting and Thunder Wave support that creates team-wide tempo
            advantage.
          </p>
          <p>
            This team covers four habitats, four weather conditions, and all three food cost tiers
            without requiring legendary resources. The balance point is that no single Pokemon can
            carry the whole route — each has a specific job and should be rotated based on which
            habitat you are running that day. As you unlock harder habitats and confirm more routes,
            Flamexor replaces Bulbin in the tank slot, Leafon enters the rotation for foggy Forest
            Valley assassin routes, and the starter four become the foundation of a larger roster.
          </p>
          <p>
            The key principle is that the team is not built around carrying a single best Pokemon — it
            is built to have a best Pokemon for each route you run regularly. Use the four slots to
            cover the habitats you visit most, and expand the roster as your material goals require
            access to more habitat types.
          </p>
        </div>
      </section>

      {/* Related Content */}
      <section className="related-content-panel" id="related">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Read Next</span>
            <h2>Related Content</h2>
          </div>
        </div>
        <div className="related-content-grid">
          <Link href="/wiki/pokemon" className="related-content-card">
            <span>Pokemon Database</span>
            <strong>Pokemon</strong>
            <p>Browse the full Pokemon database with habitat, rarity, specialty, and material drop data.</p>
          </Link>
          <Link href="/tools/team-builder" className="related-content-card">
            <span>Tool</span>
            <strong>Team Builder</strong>
            <p>Plan your four-slot team composition and check role coverage against your active habitat list.</p>
          </Link>
          <Link href="/wiki/collection" className="related-content-card">
            <span>Collection</span>
            <strong>Collection Guide</strong>
            <p>Track material drops, rarity tiers, and habitat-specific Pokemon across your progression path.</p>
          </Link>
          <Link href="/guides/beginner-route" className="related-content-card">
            <span>Guide</span>
            <strong>Beginner Route</strong>
            <p>Connect starter choices, easy habitats, recipe timing, and planning tools into one practical first route.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}
