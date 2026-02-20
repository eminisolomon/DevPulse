import { useShareTheme } from '@/hooks/useShareTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
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
    const { textColor, mutedColor, surfaceColor, accent } = useShareTheme();
    const { isDark } = useShareTheme();

    const positiveColor = isDark ? '#4ADE80' : '#22C55E';
    const negativeColor = isDark ? '#F87171' : '#EF4444';

    const isToday = date.toUpperCase().includes('TODAY');
    const dateIcon = isToday ? 'zap' : 'calendar';

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        <View style={styles.dateRow}>
          <View
            style={[
              styles.dateIconContainer,
              {
                backgroundColor: accent + '15',
                borderColor: accent + '20',
              },
            ]}
          >
            <Feather name={dateIcon} size={11} color={accent} />
          </View>
          <Typography
            variant="micro"
            weight="bold"
            color={isToday ? textColor : mutedColor}
            style={styles.dateLabel}
          >
            {date}
          </Typography>
        </View>

        <View style={styles.heroSection}>
          <Typography
            variant="display"
            weight="bold"
            color={textColor}
            style={styles.totalTime}
          >
            {totalTime}
          </Typography>
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
              <Typography
                variant="caption"
                weight="bold"
                color={isPositiveDiff ? positiveColor : negativeColor}
                style={styles.diffText}
              >
                {diffText}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          {topLanguages && topLanguages.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <Typography
                variant="micro"
                weight="bold"
                color={mutedColor}
                style={styles.statLabel}
              >
                TOP LANGUAGES
              </Typography>
              {topLanguages.slice(0, 3).map((lang, i) => (
                <View key={lang.name} style={styles.langRow}>
                  <View
                    style={[
                      styles.langDot,
                      { backgroundColor: accent, opacity: 1 - i * 0.25 },
                    ]}
                  />
                  <Typography
                    variant="body"
                    weight="semibold"
                    color={textColor}
                    style={styles.langName}
                    numberOfLines={1}
                  >
                    {lang.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    color={mutedColor}
                    style={styles.langPercent}
                  >
                    {Math.round(lang.percent)}%
                  </Typography>
                </View>
              ))}
            </View>
          )}

          {topProjects && topProjects.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <Typography
                variant="micro"
                weight="bold"
                color={mutedColor}
                style={styles.statLabel}
              >
                TOP PROJECTS
              </Typography>
              {topProjects.slice(0, 3).map((proj) => (
                <View key={proj.name} style={styles.langRow}>
                  <Feather name="folder" size={12} color={accent} />
                  <Typography
                    variant="body"
                    weight="semibold"
                    color={textColor}
                    style={styles.langName}
                    numberOfLines={1}
                  >
                    {proj.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    color={mutedColor}
                    style={styles.langPercent}
                  >
                    {proj.text}
                  </Typography>
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dateIconContainer: {
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    letterSpacing: 1.2,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  totalTime: {
    textAlign: 'center',
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  diffText: {},
  statsRow: {
    gap: 12,
  },
  statBox: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  statLabel: {
    marginBottom: 4,
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
    flex: 1,
  },
  langPercent: {
    fontVariant: ['tabular-nums'],
  },
});
