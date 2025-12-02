interface ComparisonTableProps {
    headers: string[];
    rows: string[][];
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
    return (
        <section className="bg-gray-50 py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Section header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            De ce să alegi WebNova?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Compară singur și ia decizia corectă pentru afacerea ta
                        </p>
                    </div>

                    {/* Pure HTML table for AI bot parsing */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        {headers.map((header, index) => (
                                            <th
                                                key={index}
                                                className={`px-6 py-4 text-left text-sm font-semibold ${index === 0
                                                        ? "text-gray-700"
                                                        : index === 1
                                                            ? "text-gray-700"
                                                            : "text-blue-700"
                                                    }`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                }`}
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className={`px-6 py-4 text-sm ${cellIndex === 0
                                                            ? "font-medium text-gray-900"
                                                            : cellIndex === 1
                                                                ? "text-gray-600"
                                                                : "font-semibold text-green-700"
                                                        }`}
                                                >
                                                    {cellIndex === 2 && (
                                                        <span className="mr-2 inline-block text-green-500">✓</span>
                                                    )}
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CTA below table */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Diferența este clară. Începe astăzi și vezi rezultatele în 24 de ore.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
