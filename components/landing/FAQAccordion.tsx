import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
    q: string;
    a: string;
}

interface FAQAccordionProps {
    faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    {/* Section header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Întrebări frecvente
                        </h2>
                        <p className="text-lg text-gray-600">
                            Tot ce trebuie să știi înainte de a începe
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-base leading-relaxed text-gray-600">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Additional CTA */}
                    <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center">
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                            Ai mai multe întrebări?
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Echipa noastră este aici să te ajute
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                        >
                            Contactează-ne acum
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
