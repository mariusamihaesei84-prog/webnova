import { Theme, THEMES, ThemeType } from './design-system';

/**
 * Maps Gemini's theme_type output to our design system themes
 * Handles various theme type formats from Gemini
 */
export function mapGeminiThemeToDesignTheme(geminiTheme: string): Theme {
    // Normalize the theme name
    const normalized = geminiTheme?.toLowerCase().replace(/[_-]/g, '') || '';

    // Map various Gemini outputs to our themes
    if (normalized.includes('medical') || normalized.includes('clinic') || normalized.includes('dental') || normalized.includes('doctor') || normalized.includes('health')) {
        return THEMES.clinical;
    }

    if (normalized.includes('legal') || normalized.includes('law') || normalized.includes('avocat') || normalized.includes('notar')) {
        return THEMES.legal;
    }

    if (normalized.includes('industrial') || normalized.includes('auto') || normalized.includes('repair') || normalized.includes('construct') || normalized.includes('tech')) {
        return THEMES.industrial;
    }

    if (normalized.includes('beauty') || normalized.includes('salon') || normalized.includes('spa') || normalized.includes('luxury') || normalized.includes('fashion')) {
        return THEMES.luxury;
    }

    // Default fallback
    return THEMES.clinical;
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
