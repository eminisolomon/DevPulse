import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const ProjectDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* All Time Stats Card */}
      <View style={styles.card}>
        <Skeleton width={100} height={12} style={styles.marginBottom} />
        <Skeleton width={180} height={36} />
      </View>

      {/* 7 Days Stats Grid */}
      <View style={styles.grid}>
        <View style={[styles.card, styles.flex]}>
          <Skeleton width={80} height={12} style={styles.marginBottom} />
          <Skeleton width={120} height={24} />
        </View>
        <View style={[styles.card, styles.flex]}>
          <Skeleton width={80} height={12} style={styles.marginBottom} />
          <Skeleton width={120} height={24} />
        </View>
      </View>

      {/* Languages Chart Section */}
      <View style={styles.section}>
        <Skeleton width={100} height={24} style={styles.sectionTitle} />
        <View style={styles.chartCard}>
          <Skeleton
            width={150}
            height={150}
            borderRadius={75}
            style={styles.chart}
          />
          <View style={styles.legend}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.legendItem}>
                <Skeleton
                  width={16}
                  height={16}
                  borderRadius={4}
                  style={styles.marginRight}
                />
                <Skeleton width={80} height={16} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Editors List Section */}
      <View style={styles.section}>
        <Skeleton width={80} height={24} style={styles.sectionTitle} />
        <View style={styles.listCard}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.listItem}>
              <Skeleton width={100} height={16} />
              <Skeleton width={60} height={16} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 20,
  },
  marginBottom: {
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  flex: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 200,
  },
  chart: {
    marginRight: 16,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 8,
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
