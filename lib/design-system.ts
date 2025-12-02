
export type ThemeType = 'clinical' | 'legal' | 'industrial' | 'luxury';

export interface Theme {
    type: ThemeType;
    colors: {
        background: string;
        primary: string;
        secondary: string;
        text: string;
        muted: string;
        accent: string;
    };
    typography: {
        fontFamilySans: string;
        fontFamilySerif: string;
        headingWeight: string;
    };
    borderRadius: string;
    vibe: string;
}

export const THEMES: Record<ThemeType, Theme> = {
    clinical: {
        type: 'clinical',
        colors: {
            background: 'bg-white',
            primary: 'bg-blue-600',
            secondary: 'bg-blue-50',
            text: 'text-slate-900',
            muted: 'text-slate-500',
            accent: 'text-blue-600',
        },
        typography: {
            fontFamilySans: 'font-sans',
            fontFamilySerif: 'font-sans', // Clinical uses sans mostly
            headingWeight: 'font-semibold',
        },
        borderRadius: 'rounded-2xl',
        vibe: 'Steril, Sigur',
    },
    legal: {
        type: 'legal',
        colors: {
            background: 'bg-slate-50',
            primary: 'bg-slate-900',
            secondary: 'bg-slate-200',
            text: 'text-slate-900',
            muted: 'text-slate-600',
            accent: 'text-slate-800',
        },
        typography: {
            fontFamilySans: 'font-sans',
            fontFamilySerif: 'font-serif',
            headingWeight: 'font-bold',
        },
        borderRadius: 'rounded-none',
        vibe: 'Tradiție, Putere',
    },
    industrial: {
        type: 'industrial',
        colors: {
            background: 'bg-zinc-50',
            primary: 'bg-orange-700',
            secondary: 'bg-zinc-200',
            text: 'text-zinc-900',
            muted: 'text-zinc-600',
            accent: 'text-orange-700',
        },
        typography: {
            fontFamilySans: 'font-sans',
            fontFamilySerif: 'font-sans',
            headingWeight: 'font-black',
        },
        borderRadius: 'rounded-md',
        vibe: 'Robust, Urgență',
    },
    luxury: {
        type: 'luxury',
        colors: {
            background: 'bg-stone-50',
            primary: 'bg-rose-900',
            secondary: 'bg-stone-200',
            text: 'text-stone-800',
            muted: 'text-stone-500',
            accent: 'text-rose-900',
        },
        typography: {
            fontFamilySans: 'font-sans',
            fontFamilySerif: 'font-serif', // Luxury often mixes serif headings
            headingWeight: 'font-light',
        },
        borderRadius: 'rounded-lg',
        vibe: 'Eleganță',
    },
};

export function getTheme(nicheSlug: string): Theme {
    // Simple heuristic mapping based on keywords in the slug
    // In a real app, this might be stored in the DB or use more advanced logic

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

    // Default fallback
    return THEMES.clinical;
}
