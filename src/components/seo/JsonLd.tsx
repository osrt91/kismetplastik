export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Kısmet Plastik",
    description:
      "Türkiye'nin lider kozmetik ambalaj üreticisi. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri.",
    url: "https://www.kismetplastik.com",
    telephone: "+902125498703",
    email: "bilgi@kismetplastik.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "İkitelli OSB Mahallesi İPKAS 4A Blok Sokak No:5",
      addressLocality: "Başakşehir/İstanbul",
      postalCode: "34490",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.005264,
      longitude: 28.847252,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: [
      "https://www.facebook.com/kismetplastik",
      "https://www.instagram.com/kismetplastik",
      "https://www.linkedin.com/company/kismetplastik",
      "https://www.youtube.com/@kismetplastik",
    ],
    priceRange: "$$",
    image: "https://www.kismetplastik.com/images/logo.jpg",
    "@id": "https://www.kismetplastik.com",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kısmet Plastik",
    url: "https://www.kismetplastik.com",
    logo: "https://www.kismetplastik.com/images/logo.jpg",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+902125498703",
      contactType: "sales",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [
      "https://www.facebook.com/kismetplastik",
      "https://www.instagram.com/kismetplastik",
      "https://www.linkedin.com/company/kismetplastik",
      "https://www.youtube.com/@kismetplastik",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  category,
  material,
  inStock,
  slug,
  categorySlug,
}: {
  name: string;
  description: string;
  category: string;
  material: string;
  inStock: boolean;
  slug?: string;
  categorySlug?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category,
    material,
    brand: {
      "@type": "Brand",
      name: "Kısmet Plastik",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Kısmet Plastik",
    },
    ...(slug && categorySlug
      ? { url: `https://www.kismetplastik.com/tr/urunler/${categorySlug}/${slug}` }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "TRY",
      seller: {
        "@type": "Organization",
        name: "Kısmet Plastik",
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "TRY",
        eligibleTransactionVolume: {
          "@type": "QuantitativeValue",
          unitCode: "C62",
          value: 5000,
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingJsonLd({
  title,
  description,
  datePublished,
  slug,
  locale,
}: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: "Kısmet Plastik",
      url: "https://www.kismetplastik.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Kısmet Plastik",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kismetplastik.com/images/logo.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.kismetplastik.com/${locale}/blog/${slug}`,
    },
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
