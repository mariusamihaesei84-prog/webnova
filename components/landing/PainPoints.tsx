import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PainPoint {
    icon: string;
    title: string;
    desc: string;
}

interface PainPointsProps {
    painPoints: PainPoint[];
}

export function PainPoints({ painPoints }: PainPointsProps) {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Section header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Provocările tale actuale
                        </h2>
                        <p className="text-lg text-gray-600">
                            Știm exact cu ce te confrunți în fiecare zi
                        </p>
                    </div>

                    {/* Pain points grid */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {painPoints.map((point, index) => {
                            // Dynamically get the Lucide icon
                            const IconComponent = getIconComponent(point.icon);

                            return (
                                <div
                                    key={index}
                                    className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-red-300 hover:shadow-md"
                                >
                                    {/* Icon */}
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                                        <IconComponent className="h-6 w-6 text-red-600" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        {point.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {point.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * Safely get Lucide icon component by name
 */
function getIconComponent(iconName: string): LucideIcon {
    // Convert kebab-case to PascalCase (e.g., "trending-down" -> "TrendingDown")
    const pascalCaseName = iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

    // Get the icon from Lucide exports
    const Icon = (LucideIcons as any)[pascalCaseName];

    // Fallback to AlertCircle if icon not found
    return Icon || LucideIcons.AlertCircle;
}
