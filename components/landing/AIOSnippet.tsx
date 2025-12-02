interface AIOSnippetProps {
    heading: string;
    text: string;
}

export function AIOSnippet({ heading, text }: AIOSnippetProps) {
    return (
        <section
            id="ai-summary"
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            <div className="mx-auto max-w-4xl">
                <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-6 shadow-sm">
                    {/* Icon */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
                    </div>

                    {/* Content optimized for AI extraction */}
                    <div className="prose prose-blue max-w-none">
                        <p className="text-base leading-relaxed text-gray-700">{text}</p>
                    </div>

                    {/* AI-friendly label */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                        <span>Rezumat optimizat pentru ChatGPT și Perplexity</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
