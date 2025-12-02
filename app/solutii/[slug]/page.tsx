"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import { getTheme } from "@/lib/design-system";
import { mapGeminiThemeToDesignTheme } from "@/lib/theme-utils";
import * as LucideIcons from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Dynamic landing page with theme adaptation and dynamic images
 */
export default function LandingPage({ params }: PageProps) {
    const { slug } = use(params);

    const page = useQuery(api.pages.getPageBySlug, {
        slug: `solutii/${slug}`,
    });

    // Loading state
    if (page === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Se încarcă...</p>
                </div>
            </div>
        );
    }

    // Not found
    if (!page || !page.niche) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
                    <p className="text-gray-600">Pagina nu a fost găsită</p>
                </div>
            </div>
        );
    }

    // Parse the content JSON
    const content = page.content_json;

    // Get theme based on Gemini's theme_type (with fallback to slug)
    const theme = content.theme_type
        ? mapGeminiThemeToDesignTheme(content.theme_type)
        : getTheme(slug);

    // Generate dynamic image URL for Hero section
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        content.image_prompt
    )}?width=1200&height=600&nologo=true`;

    const pageUrl = `https://webnova.ro/solutii/${slug}`;

    // Generate JSON-LD schemas
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "WebNova - Site Inteligent cu SEO Automat",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: content.seo.description,
        url: pageUrl,
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((item: any) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
            },
        })),
    };

    return (
        <>
            {/* Head metadata and scripts */}
            <head>
                <title>{content.seo.title}</title>
                <meta name="description" content={content.seo.description} />
                <link rel="canonical" href={pageUrl} />

                {/* JSON-LD Structured Data for SEO & AIO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(softwareSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema),
                    }}
                />
            </head>

            {/* Main content */}
            <main className={`min-h-screen ${theme.colors.background}`}>
                {/* Hero Section with Dynamic Image */}
                <section className="relative overflow-hidden">
                    <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Hero Content */}
                            <div className="space-y-8">
                                <h1
                                    className={`text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${theme.colors.text} ${theme.typography.fontFamilySerif} ${theme.typography.headingWeight}`}
                                >
                                    {content.hero.headline}
                                </h1>
                                <p className={`text-lg sm:text-xl ${theme.colors.muted}`}>
                                    {content.hero.subheadline}
                                </p>
                                <button
                                    className={`${theme.colors.primary} ${theme.borderRadius} px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
                                >
                                    {content.hero.cta}
                                </button>
                            </div>

                            {/* Dynamic Hero Image */}
                            <div className={`relative ${theme.borderRadius} overflow-hidden shadow-2xl`}>
                                <img
                                    src={imageUrl}
                                    alt={content.hero.headline}
                                    className="h-auto w-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* AIO Snippet - Critical for AI Search optimization */}
                <section
                    id="ai-summary"
                    className={`${theme.colors.secondary} py-16`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`mx-auto max-w-4xl ${theme.borderRadius} ${theme.colors.background} p-8 shadow-lg`}>
                            <h2 className={`mb-4 text-2xl font-bold ${theme.colors.accent}`}>
                                {content.aio_snippet.heading}
                            </h2>
                            <p className={`text-lg leading-relaxed ${theme.colors.text}`}>
                                {content.aio_snippet.text}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bento Grid - Pain Points */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            {content.pain_points.map((point: any, index: number) => {
                                const IconComponent =
                                    (LucideIcons as any)[
                                    point.icon.split("-").reduce((acc: string, part: string) => {
                                        return (
                                            acc + part.charAt(0).toUpperCase() + part.slice(1)
                                        );
                                    }, "")
                                    ] || LucideIcons.AlertCircle;

                                return (
                                    <div
                                        key={index}
                                        className={`${theme.borderRadius} ${theme.colors.secondary} p-8 transition-all duration-200 hover:shadow-xl`}
                                    >
                                        <IconComponent
                                            className={`mb-4 h-12 w-12 ${theme.colors.accent}`}
                                        />
                                        <h3
                                            className={`mb-3 text-xl font-bold ${theme.colors.text} ${theme.typography.headingWeight}`}
                                        >
                                            {point.title}
                                        </h3>
                                        <p className={theme.colors.muted}>{point.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Comparison Table - SEO Friendly */}
                <section className={`${theme.colors.secondary} py-20`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="overflow-x-auto">
                            <table
                                className={`w-full ${theme.borderRadius} ${theme.colors.background} shadow-xl`}
                            >
                                <thead>
                                    <tr className={theme.colors.secondary}>
                                        {content.comparison_table.headers.map(
                                            (header: string, index: number) => (
                                                <th
                                                    key={index}
                                                    className={`px-6 py-4 text-left text-sm font-bold uppercase ${theme.colors.text}`}
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.comparison_table.rows.map(
                                        (row: string[], rowIndex: number) => (
                                            <tr
                                                key={rowIndex}
                                                className={`border-t ${rowIndex % 2 === 0 ? theme.colors.background : theme.colors.secondary}`}
                                            >
                                                {row.map((cell: string, cellIndex: number) => (
                                                    <td
                                                        key={cellIndex}
                                                        className={`px-6 py-4 ${cellIndex === 0 ? `font-semibold ${theme.colors.text}` : theme.colors.muted}`}
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ Accordion */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            className={`mb-12 text-center text-3xl font-bold ${theme.colors.text} ${theme.typography.fontFamilySerif} ${theme.typography.headingWeight}`}
                        >
                            Întrebări Frecvente
                        </h2>
                        <div className="mx-auto max-w-3xl space-y-4">
                            {content.faq.map((item: any, index: number) => (
                                <details
                                    key={index}
                                    className={`${theme.borderRadius} ${theme.colors.secondary} p-6 shadow-md transition-all duration-200 hover:shadow-lg`}
                                >
                                    <summary
                                        className={`cursor-pointer text-lg font-semibold ${theme.colors.text}`}
                                    >
                                        {item.q}
                                    </summary>
                                    <p className={`mt-4 ${theme.colors.muted}`}>{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className={`${theme.colors.primary} py-20`}>
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                            Ești gata să începi?
                        </h2>
                        <p className="mb-8 text-lg text-white/90">
                            Alătură-te celor care au ales deja soluția inteligentă
                        </p>
                        <button
                            className={`${theme.borderRadius} bg-white px-8 py-4 text-lg font-semibold ${theme.colors.accent} shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
                        >
                            {content.hero.cta}
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}
