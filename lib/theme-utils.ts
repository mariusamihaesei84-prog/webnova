import { Theme, THEMES, ThemeType } from './design-system';

/**
 * Maps Gemini's theme_type output to our design system themes
 */
export function mapGeminiThemeToDesignTheme(geminiTheme: 'medical' | 'legal' | 'industrial' | 'beauty'): Theme {
    const mapping: Record<'medical' | 'legal' | 'industrial' | 'beauty', ThemeType> = {
        medical: 'clinical',
        legal: 'legal',
        industrial: 'industrial',
        beauty: 'luxury',
    };

    return THEMES[mapping[geminiTheme]];
}

/**
 * Get the best theme for a niche, with fallback to Gemini's suggestion
 */
export function getOptimalTheme(
    nicheSlug: string,
    geminiThemeType?: 'medical' | 'legal' | 'industrial' | 'beauty'
): Theme {
    // If Gemini provided a theme type, use it
    if (geminiThemeType) {
        return mapGeminiThemeToDesignTheme(geminiThemeType);
    }

    // Otherwise, fall back to slug-based detection
    if (nicheSlug.includes('medic') || nicheSlug.includes('dentist') || nicheSlug.includes('clinica') || nicheSlug.includes('doctor')) {
        return THEMES.clinical;
    }

    if (nicheSlug.includes('avocat') || nicheSlug.includes('contabil') || nicheSlug.includes('notar') || nicheSlug.includes('juridic')) {
        return THEMES.legal;
    }

    if (nicheSlug.includes('construct') || nicheSlug.includes('instalator') || nicheSlug.includes('auto') || nicheSlug.includes('reparatii')) {
        return THEMES.industrial;
    }

    if (nicheSlug.includes('beauty') || nicheSlug.includes('salon') || nicheSlug.includes('arhitect') || nicheSlug.includes('design')) {
        return THEMES.luxury;
    }

    // Ultimate fallback
    return THEMES.clinical;
}
