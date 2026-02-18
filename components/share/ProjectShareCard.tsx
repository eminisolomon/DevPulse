import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShareCardWrapper } from './ShareCardWrapper';

interface ProjectShareCardProps {
  projectName: string;
  allTimeTotal: string;
  total7d: string;
  dailyAvg: string;
  topLanguages?: Array<{ name: string; percent: number }>;
}

export const ProjectShareCard = forwardRef<View, ProjectShareCardProps>(
  ({ projectName, allTimeTotal, total7d, dailyAvg, topLanguages }, ref) => {
    const { isDark, theme } = useTheme();

    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#888888' : '#666666';
    const surfaceColor = isDark ? '#1A1A1A' : '#F3F4F6';
    const accent = theme.colors.primary;

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        {/* Project name */}
        <View style={styles.nameRow}>
          <View
            style={[styles.projectIcon, { backgroundColor: accent + '20' }]}
          >
            <Feather name="folder" size={16} color={accent} />
          </View>
          <Text
            style={[styles.projectName, { color: textColor }]}
            numberOfLines={1}
          >
            {projectName}
          </Text>
        </View>

        {/* Hero stat */}
        <View>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            ALL TIME
          </Text>
          <Text style={[styles.heroTime, { color: textColor }]}>
            {allTimeTotal}
          </Text>
        </View>

        {/* Two-col stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.gridCell, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.cellLabel, { color: mutedColor }]}>
              LAST 7 DAYS
            </Text>
            <Text style={[styles.cellValue, { color: accent }]}>{total7d}</Text>
          </View>
          <View style={[styles.gridCell, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.cellLabel, { color: mutedColor }]}>
              DAILY AVG
            </Text>
            <Text style={[styles.cellValue, { color: textColor }]}>
              {dailyAvg}
            </Text>
          </View>
        </View>

        {/* Languages */}
        {topLanguages && topLanguages.length > 0 && (
          <View style={[styles.langBox, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.statLabel, { color: mutedColor }]}>
              LANGUAGES
            </Text>
            <View style={styles.langBarContainer}>
              {topLanguages.slice(0, 5).map((lang, i) => (
                <View
                  key={lang.name}
                  style={[
                    styles.langBarSegment,
                    {
                      flex: lang.percent,
                      backgroundColor: accent,
                      opacity: 1 - i * 0.15,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.langLabels}>
              {topLanguages.slice(0, 4).map((lang, i) => (
                <View key={lang.name} style={styles.langLabelRow}>
                  <View
                    style={[
                      styles.langDot,
                      { backgroundColor: accent, opacity: 1 - i * 0.15 },
                    ]}
                  />
                  <Text
                    style={[styles.langName, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {lang.name}
                  </Text>
                  <Text style={[styles.langPercent, { color: mutedColor }]}>
                    {Math.round(lang.percent)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ShareCardWrapper>
    );
  },
);

ProjectShareCard.displayName = 'ProjectShareCard';

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heroTime: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCell: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  cellLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  cellValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  langBox: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  langBarContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    gap: 2,
  },
  langBarSegment: {
    borderRadius: 4,
  },
  langLabels: {
    gap: 8,
  },
  langLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  langName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  langPercent: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
