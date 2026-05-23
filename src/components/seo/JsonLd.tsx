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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pokopia.wiki/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pokopia Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pokopia.wiki/logo.png',
        width: 512,
        height: 512,
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
  image,
  author,
  type = 'Article',
}: {
  title: string
  description: string
  url: string
  publishedAt: string
  modifiedAt?: string
  image?: string
  author?: string
  type?: 'Article' | 'NewsArticle' | 'Guide'
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    url: `https://pokopia.wiki${url}`,
    ...(image ? { image } : {}),
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
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pokopia.wiki${url}`,
    },
  }

  return <JsonLd data={jsonLd} />
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://pokopia.wiki${item.url}`,
    })),
  }

  return <JsonLd data={jsonLd} />
}

export function WikiPageJsonLd({
  name,
  description,
  url,
  pageType,
  image,
  dateModified,
  properties,
}: {
  name: string
  description?: string
  url: string
  pageType: 'Pokemon' | 'Habitat' | 'Recipe'
  image?: string
  dateModified?: string
  properties?: { name: string; value: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `https://pokopia.wiki${url}`,
    ...(image ? { image } : {}),
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Pokopia Portal',
      url: 'https://pokopia.wiki',
    },
    about: {
      '@type': 'Thing',
      name,
      description,
      additionalType: `https://pokopia.wiki/schema/${pageType.toLowerCase()}`,
    },
    ...(properties && properties.length > 0 ? {
      additionalProperty: properties.map((property) => ({
        '@type': 'PropertyValue',
        name: property.name,
        value: property.value,
      })),
    } : {}),
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
