import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    headline: string;
    subheadline: string;
    cta: string;
}

export function HeroSection({ headline, subheadline, cta }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
                    <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-blue-400 to-purple-400" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        </span>
                        Generat automat cu AI · Optimizat pentru Google și ChatGPT
                    </div>

                    {/* Headline */}
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {headline}
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mb-10 text-lg leading-relaxed text-gray-600 sm:text-xl">
                        {subheadline}
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        >
                            {cta}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                        >
                            Află Mai Multe
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Fără costuri inițiale</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Livrare în 24h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>SEO inclus</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
