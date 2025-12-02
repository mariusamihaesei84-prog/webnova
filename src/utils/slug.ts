/**
 * Romanian Diacritics Mapping
 *
 * Maps Romanian special characters to their ASCII equivalents
 */
const ROMANIAN_DIACRITICS_MAP: Record<string, string> = {
  'ă': 'a',
  'â': 'a',
  'î': 'i',
  'ș': 's',
  'ț': 't',
  'Ă': 'a',
  'Â': 'a',
  'Î': 'i',
  'Ș': 's',
  'Ț': 't',
};

/**
 * Generate URL-safe slug from Romanian business entity name
 *
 * Converts a business entity string into a URL-safe slug by:
 * - Converting to lowercase
 * - Replacing Romanian diacritics with ASCII equivalents
 * - Replacing spaces with hyphens
 * - Removing special characters
 * - Removing multiple consecutive hyphens
 * - Trimming leading/trailing hyphens
 *
 * @param businessEntity - The business entity name (e.g., "Cabinet Stomatologic")
 * @returns URL-safe slug (e.g., "cabinet-stomatologic")
 *
 * @example
 * ```typescript
 * generateSlug("Cabinet Stomatologic") // "cabinet-stomatologic"
 * generateSlug("Birou Arhitectură & Design") // "birou-arhitectura-design"
 * generateSlug("Salon Înfrumusețare") // "salon-infrumusetare"
 * ```
 */
export function generateSlug(businessEntity: string): string {
  if (!businessEntity || typeof businessEntity !== 'string') {
    throw new Error('businessEntity must be a non-empty string');
  }

  let slug = businessEntity;

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Replace Romanian diacritics
  slug = slug.replace(/[ăâîșțĂÂÎȘȚ]/g, (char) => ROMANIAN_DIACRITICS_MAP[char] || char);

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove special characters (keep only alphanumeric and hyphens)
  slug = slug.replace(/[^a-z0-9-]/g, '');

  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // Trim leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Validate if a string is a valid slug format
 *
 * @param slug - The string to validate
 * @returns True if the string is a valid slug
 *
 * @example
 * ```typescript
 * isValidSlug("cabinet-stomatologic") // true
 * isValidSlug("Cabinet Stomatologic") // false
 * isValidSlug("cabinet--stomatologic") // false
 * ```
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Valid slug: lowercase alphanumeric with single hyphens, no leading/trailing hyphens
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}
