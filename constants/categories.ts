import { generateDeterministicColor } from '@/utilities/colors';

/**
 * Mappings for WakaTime Category colors.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Coding: '#3B82F6',
  Debugging: '#EF4444',
  Browsing: '#F59E0B',
  'Code Review': '#8B5CF6',
  Design: '#EC4899',
  Designing: '#EC4899',
  Documentation: '#10B981',
  Build: '#6366F1',
  Testing: '#84CC16',
  Meeting: '#14B8A6',
  Running: '#06B6D4',
  Writing: '#F97316',
  Other: '#64748B',
};

export const getCategoryColor = (category: string): string => {
  if (!category) return '#64748B';
  return CATEGORY_COLORS[category] || generateDeterministicColor(category);
};
