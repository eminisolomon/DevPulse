import { Card, Typography } from '@/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AIProductivityCardProps {
  aiAdditions: number;
  aiDeletions: number;
  humanAdditions: number;
  humanDeletions: number;
}

export const AIProductivityCard = ({
  aiAdditions,
  aiDeletions,
  humanAdditions,
  humanDeletions,
}: AIProductivityCardProps) => {
  const totalAdditions = aiAdditions + humanAdditions;
  const aiAddPercent =
    totalAdditions > 0 ? (aiAdditions / totalAdditions) * 100 : 0;
  const humanAddPercent =
    totalAdditions > 0 ? (humanAdditions / totalAdditions) * 100 : 100;

  return (
    <Card style={styles.container}>
      <Typography
        variant="title"
        style={styles.title}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        AI PRODUCTIVITY INDEX
      </Typography>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Typography variant="caption" color="gray">
            AI CHANGES
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color="#4ADE80"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {aiAdditions + aiDeletions}
          </Typography>
          <Typography variant="caption">
            {aiAdditions} + / {aiDeletions} -
          </Typography>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Typography variant="caption" color="gray">
            HUMAN CHANGES
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color="#6366F1"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {humanAdditions + humanDeletions}
          </Typography>
          <Typography variant="caption">
            {humanAdditions} + / {humanDeletions} -
          </Typography>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${aiAddPercent}%`, backgroundColor: '#4ADE80' },
          ]}
        />
        <View
          style={[
            styles.progressBar,
            { width: `${humanAddPercent}%`, backgroundColor: '#6366F1' },
          ]}
        />
      </View>

      <View style={styles.row}>
        <Typography variant="caption">
          AI Assistant: {aiAddPercent.toFixed(1)}%
        </Typography>
        <Typography variant="caption">
          Manual Typing: {humanAddPercent.toFixed(1)}%
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    letterSpacing: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  progressContainer: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
