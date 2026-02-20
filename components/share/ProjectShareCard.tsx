import { useShareTheme } from '@/hooks/useShareTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShareCardWrapper } from './ShareCardWrapper';
import { Typography } from '../Typography';
import { StatBox } from '../StatBox';

interface ProjectShareCardProps {
  projectName: string;
  allTimeTotal: string;
  total7d: string;
  dailyAvg: string;
  topLanguages?: Array<{ name: string; percent: number }>;
}

export const ProjectShareCard = forwardRef<View, ProjectShareCardProps>(
  ({ projectName, allTimeTotal, total7d, dailyAvg, topLanguages }, ref) => {
    const { textColor, mutedColor, surfaceColor, accent } = useShareTheme();

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        {/* Project name */}
        <View style={styles.nameRow}>
          <View
            style={[styles.projectIcon, { backgroundColor: accent + '20' }]}
          >
            <Feather name="folder" size={16} color={accent} />
          </View>
          <Typography
            variant="title"
            weight="bold"
            color={textColor}
            style={styles.projectName}
            numberOfLines={1}
          >
            {projectName}
          </Typography>
        </View>

        {/* Hero stat */}
        <View>
          <Typography
            variant="micro"
            weight="bold"
            color={mutedColor}
            style={styles.statLabel}
          >
            ALL TIME
          </Typography>
          <Typography
            variant="display"
            weight="bold"
            color={textColor}
            style={styles.heroTime}
          >
            {allTimeTotal}
          </Typography>
        </View>

        {/* Two-col stats */}
        <View style={styles.statsGrid}>
          <StatBox
            label="LAST 7 DAYS"
            value={total7d}
            valueColor={accent}
            style={{ backgroundColor: surfaceColor }}
          />
          <StatBox
            label="DAILY AVG"
            value={dailyAvg}
            valueColor={textColor}
            style={{ backgroundColor: surfaceColor }}
          />
        </View>

        {/* Languages */}
        {topLanguages && topLanguages.length > 0 && (
          <View style={[styles.langBox, { backgroundColor: surfaceColor }]}>
            <Typography
              variant="micro"
              weight="bold"
              color={mutedColor}
              style={styles.statLabel}
            >
              LANGUAGES
            </Typography>
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
    flex: 1,
  },
  statLabel: {
    marginBottom: 6,
  },
  heroTime: {
    fontSize: 40,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
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
    flex: 1,
  },
  langPercent: {
    fontVariant: ['tabular-nums'],
  },
});
