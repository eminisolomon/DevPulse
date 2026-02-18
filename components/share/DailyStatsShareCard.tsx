import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShareCardWrapper } from './ShareCardWrapper';

interface DailyStatsShareCardProps {
  date: string;
  totalTime: string;
  diffText?: string;
  isPositiveDiff?: boolean;
  topLanguages?: Array<{ name: string; percent: number }>;
  topProjects?: Array<{ name: string; text: string }>;
}

export const DailyStatsShareCard = forwardRef<View, DailyStatsShareCardProps>(
  (
    { date, totalTime, diffText, isPositiveDiff, topLanguages, topProjects },
    ref,
  ) => {
    const { isDark, theme } = useTheme();

    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#888888' : '#666666';
    const surfaceColor = isDark ? '#1A1A1A' : '#F3F4F6';
    const accent = theme.colors.primary;
    const positiveColor = isDark ? '#4ADE80' : '#22C55E';
    const negativeColor = isDark ? '#F87171' : '#EF4444';

    return (
      <ShareCardWrapper ref={ref}>
        {/* Date label */}
        <Text style={[styles.dateLabel, { color: mutedColor }]}>{date}</Text>

        {/* Hero total time */}
        <View style={styles.heroSection}>
          <Text style={[styles.totalTime, { color: textColor }]}>
            {totalTime}
          </Text>
          {diffText ? (
            <View
              style={[
                styles.diffBadge,
                {
                  backgroundColor:
                    (isPositiveDiff ? positiveColor : negativeColor) + '18',
                },
              ]}
            >
              <Feather
                name={isPositiveDiff ? 'trending-up' : 'trending-down'}
                size={13}
                color={isPositiveDiff ? positiveColor : negativeColor}
              />
              <Text
                style={[
                  styles.diffText,
                  { color: isPositiveDiff ? positiveColor : negativeColor },
                ]}
              >
                {diffText}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stats grid */}
        <View style={styles.statsRow}>
          {/* Languages */}
          {topLanguages && topLanguages.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <Text style={[styles.statLabel, { color: mutedColor }]}>
                TOP LANGUAGES
              </Text>
              {topLanguages.slice(0, 3).map((lang, i) => (
                <View key={lang.name} style={styles.langRow}>
                  <View
                    style={[
                      styles.langDot,
                      { backgroundColor: accent, opacity: 1 - i * 0.25 },
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
          )}

          {/* Projects */}
          {topProjects && topProjects.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <Text style={[styles.statLabel, { color: mutedColor }]}>
                TOP PROJECTS
              </Text>
              {topProjects.slice(0, 3).map((proj) => (
                <View key={proj.name} style={styles.langRow}>
                  <Feather name="folder" size={12} color={accent} />
                  <Text
                    style={[styles.langName, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {proj.name}
                  </Text>
                  <Text style={[styles.langPercent, { color: mutedColor }]}>
                    {proj.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ShareCardWrapper>
    );
  },
);

DailyStatsShareCard.displayName = 'DailyStatsShareCard';

const styles = StyleSheet.create({
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroSection: {
    alignItems: 'flex-start',
    gap: 8,
  },
  totalTime: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  diffText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    gap: 10,
  },
  statBox: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  langName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  langPercent: {
    fontSize: 12,
    fontWeight: '500',
  },
});
