/**
 * JSON-LD Schema Generators for SEO
 * 
 * Creates structured data for Google and AI search engines
 */

export interface FAQItem {
    q: string;
    a: string;
}

/**
 * Generate SoftwareApplication schema for WebNova platform
 */
export function generateSoftwareApplicationSchema(pageUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WebNova - Site Inteligent cu SEO Automat",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Platformă SaaS pentru generarea automată de site-uri optimizate SEO",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127",
        },
        "description": "Platformă SaaS care generează automat site-uri web optimizate pentru Google și AI Search, cu SEO inclus și actualizări nelimitate.",
        "url": pageUrl,
    };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqItems: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a,
            },
        })),
    };
}

/**
 * Generate Product schema for the service offering
 */
export function generateProductSchema(
    nicheName: string,
    pageUrl: string,
    metaDescription: string
) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `WebNova pentru ${nicheName}`,
        "description": metaDescription,
        "brand": {
            "@type": "Brand",
            "name": "WebNova.ro",
        },
        "offers": {
            "@type": "Offer",
            "url": pageUrl,
            "priceCurrency": "EUR",
            "price": "0",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "89",
        },
    };
}

/**
 * Generate Organization schema for WebNova
 */
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WebNova.ro",
        "url": "https://webnova.ro",
        "logo": "https://webnova.ro/logo.png",
        "description": "Platformă SaaS pentru generarea automată de site-uri optimizate SEO și AIO",
        "foundingDate": "2001",
        "sameAs": [
            "https://www.facebook.com/webnova",
            "https://www.linkedin.com/company/webnova",
        ],
    };
}
