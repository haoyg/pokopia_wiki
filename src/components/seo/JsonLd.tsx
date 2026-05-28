import { BASE_URL } from '@/lib/site'

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
    url: BASE_URL,
    description: 'Independent Pokopia wiki with official source roundups, guides, Pokemon database pages, habitat notes, recipes, and planning tools.',
    about: {
      '@type': 'Thing',
      name: 'Pokopia',
      description: 'A gaming content platform covering Pokemon-style game guides, database, and community tools.',
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pokopia Portal',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
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
    url: `${BASE_URL}${url}`,
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
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${url}`,
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
      item: `${BASE_URL}${item.url}`,
    })),
  }

  return <JsonLd data={jsonLd} />
}

export function ItemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string
  description?: string
  url: string
  items: { name: string; url: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    url: `${BASE_URL}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}${item.url}`,
    })),
  }

  return <JsonLd data={jsonLd} />
}

export function ToolJsonLd({
  name,
  description,
  url,
  applicationCategory = 'GameApplication',
  featureList,
}: {
  name: string
  description: string
  url: string
  applicationCategory?: string
  featureList?: string[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory,
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    ...(featureList && featureList.length > 0 ? { featureList } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Pokopia Portal',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Pokopia Portal',
      url: BASE_URL,
    },
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
    url: `${BASE_URL}${url}`,
    ...(image ? { image } : {}),
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Pokopia Portal',
      url: BASE_URL,
    },
    about: {
      '@type': 'Thing',
      name,
      description,
      additionalType: `${BASE_URL}/schema/${pageType.toLowerCase()}`,
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
