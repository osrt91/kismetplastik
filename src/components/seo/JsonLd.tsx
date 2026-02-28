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
    sameAs: [],
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
    sameAs: [],
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
}: {
  name: string;
  description: string;
  category: string;
  material: string;
  inStock: boolean;
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
    offers: {
      "@type": "Offer",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "TRY",
      seller: {
        "@type": "Organization",
        name: "Kısmet Plastik",
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
