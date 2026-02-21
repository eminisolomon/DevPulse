/**
 * Utility for mapping programming languages to their representative colors.
 * Standard colors are now fetched dynamically from the WakaTime API.
 */

const DEFAULT_COLOR = '#6e7681';

/**
 * Get the color for a programming language.
 * Returns a default gray color if the language is not mapped.
 * Note: Components should ideally use useMetadata() for dynamic colors.
 */
export const getLanguageColor = (languageName: string): string => {
  return DEFAULT_COLOR;
};
