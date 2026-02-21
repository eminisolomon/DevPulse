import { generateDeterministicColor } from '@/utilities/colors';

/**
 * Mappings for Operating System colors.
 */
export const OS_COLORS: Record<string, string> = {
  Mac: '#A2AAAD',
  Windows: '#0078D6',
  Linux: '#FCC624',
  Android: '#3DDC84',
  iOS: '#000000',
  Chrome: '#4285F4',
  Other: '#64748B',
};

export const getOSColor = (osName: string): string => {
  if (!osName) return '#64748B';

  if (osName.includes('Mac')) return OS_COLORS.Mac;
  if (osName.includes('Windows')) return OS_COLORS.Windows;

  return OS_COLORS[osName] || generateDeterministicColor(osName);
};
