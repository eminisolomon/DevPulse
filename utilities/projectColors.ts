import { ALPHABET_COLORS } from '@/constants/alphabet';

/**
 * Deterministically gets a color for a project name.
 * Uses the first letter to select from ALPHABET_COLORS.
 */
export const getProjectColor = (projectName: string): string => {
  if (!projectName) return ALPHABET_COLORS['A'];

  const firstChar = projectName.charAt(0).toUpperCase();

  return ALPHABET_COLORS[firstChar] || '#64748B';
};
