import { useShareTheme } from '@/hooks/useShareTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { ShareCardWrapper } from './ShareCardWrapper';

interface ProjectShareCardProps {
  projectName: string;
  allTimeTotal: string;
  total7d: string;
  dailyAvg: string;
  topLanguages?: Array<{ name: string; percent: number }>;
  color?: string;
}

export const ProjectShareCard = forwardRef<View, ProjectShareCardProps>(
  (
    { projectName, allTimeTotal, total7d, dailyAvg, topLanguages, color },
    ref,
  ) => {
    const {
      textColor,
      mutedColor,
      surfaceColor,
      accent: themeAccent,
    } = useShareTheme();
    const accent = color || themeAccent;

    return (
      <ShareCardWrapper ref={ref} outerPadding={24} accentColor={accent}>
        <View style={styles.topContainer}>
          <View style={styles.nameRow}>
            <View
              style={[styles.projectIcon, { backgroundColor: accent + '15' }]}
            >
              <Feather name="folder" size={20} color={accent} />
            </View>
            <View style={styles.nameInfo}>
              <Typography
                variant="micro"
                weight="bold"
                color={mutedColor}
                style={styles.label}
              >
                PROJECT
              </Typography>
              <Typography
                variant="title"
                weight="bold"
                color={textColor}
                numberOfLines={1}
              >
                {projectName}
              </Typography>
            </View>
          </View>

          <View style={styles.heroSection}>
            <Typography
              variant="micro"
              weight="bold"
              color={mutedColor}
              style={styles.label}
            >
              TOTAL TIME INVESTED
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
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statItem, { backgroundColor: surfaceColor }]}>
            <Typography variant="micro" weight="bold" color={mutedColor}>
              LAST 7 DAYS
            </Typography>
            <Typography variant="body" weight="bold" color={accent}>
              {total7d}
            </Typography>
          </View>
          <View style={[styles.statItem, { backgroundColor: surfaceColor }]}>
            <Typography variant="micro" weight="bold" color={mutedColor}>
              DAILY AVG
            </Typography>
            <Typography variant="body" weight="bold" color={textColor}>
              {dailyAvg}
            </Typography>
          </View>
        </View>

        {/* Languages */}
        {topLanguages && topLanguages.length > 0 && (
          <View style={[styles.langBox, { backgroundColor: surfaceColor }]}>
            <View style={styles.langHeader}>
              <Feather name="code" size={14} color={accent} />
              <Typography variant="micro" weight="bold" color={mutedColor}>
                CORE LANGUAGES
              </Typography>
            </View>

            <View style={styles.langBarContainer}>
              {topLanguages.slice(0, 5).map((lang, i) => (
                <View
                  key={lang.name}
                  style={[
                    styles.langBarSegment,
                    {
                      width: `${lang.percent}%`,
                      backgroundColor: accent,
                      opacity: 1 - i * 0.15,
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.langLabels}>
              {topLanguages.slice(0, 3).map((lang, i) => (
                <View key={lang.name} style={styles.langLabelRow}>
                  <View
                    style={[
                      styles.langDot,
                      { backgroundColor: accent, opacity: 1 - i * 0.15 },
                    ]}
                  />
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={textColor}
                    style={styles.langName}
                    numberOfLines={1}
                  >
                    {lang.name}
                  </Typography>
                  <Typography variant="micro" weight="bold" color={mutedColor}>
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
  topContainer: {
    alignItems: 'center',
    gap: 16,
  },
  nameRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInfo: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    letterSpacing: 1,
    opacity: 0.8,
  },
  heroSection: {
    alignItems: 'center',
    gap: 4,
  },
  heroTime: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  langBox: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  langBarSegment: {
    height: '100%',
  },
  langLabels: {
    gap: 10,
  },
  langLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  langName: {
    flex: 1,
  },
});
