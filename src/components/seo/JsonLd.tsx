type JsonLdProps = {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pokopia Portal',
    url: 'https://pokopia.wiki',
    description: 'Your ultimate Pokopia wiki - guides, Pokemon database, habitat maps, recipes, and community builds.',
    // Note: searchAction disabled - /search page not implemented
    // potentialAction: {
    //   '@type': 'SearchAction',
    //   target: { '@type': 'EntryPoint', urlTemplate: 'https://pokopia.wiki/search?q={search_term_string}' },
    //   'query-input': 'required name=search_term_string',
    // },
    publisher: {
      '@type': 'Organization',
      name: 'Pokopia Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pokopia.wiki/logo.png',
      },
    },
  }

  return <JsonLd data={jsonLd} />
}

export function ArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  modifiedAt,
  author,
  type = 'Article',
}: {
  title: string
  description: string
  url: string
  publishedAt: string
  modifiedAt?: string
  author?: string
  type?: 'Article' | 'NewsArticle' | 'Guide'
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    url: `https://pokopia.wiki${url}`,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Organization',
      name: author || 'Pokopia Portal',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pokopia Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pokopia.wiki/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pokopia.wiki${url}`,
    },
  }

  return <JsonLd data={jsonLd} />
}

export function FAQJsonLd({
  faqs,
  title,
}: {
  faqs: { question: string; answer: string }[]
  title: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={jsonLd} />
}
