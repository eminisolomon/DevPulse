import { generateDeterministicColor } from '@/utilities/colors';
import { ALPHABET_COLORS } from './alphabet';

/**
 * Mappings for Workstation/Machine colors.
 * Uses a deterministic hash/alphabet fallback since machine names are user-defined.
 */
export const getWorkstationColor = (machineName: string): string => {
  if (!machineName) return '#64748B';

  const firstChar = machineName.charAt(0).toUpperCase();
  if (ALPHABET_COLORS[firstChar]) {
    return ALPHABET_COLORS[firstChar];
  }

  return generateDeterministicColor(machineName);
};
