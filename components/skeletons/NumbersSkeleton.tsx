import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const NumbersSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Time Range Selector */}
      <Skeleton
        width="100%"
        height={40}
        borderRadius={20}
        style={styles.marginBottom}
      />

      {/* Stats Grid */}
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <View key={key} style={styles.card}>
            <Skeleton
              width={48}
              height={48}
              borderRadius={12}
              style={styles.marginRight}
            />
            <View style={styles.flex}>
              <Skeleton
                width={80}
                height={12}
                style={styles.marginBottomSmall}
              />
              <Skeleton width={60} height={20} />
            </View>
          </View>
        ))}
      </View>

      {/* Segmented Stats Cards */}
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.segmentedCard}>
          <Skeleton width={120} height={20} style={styles.marginBottom} />
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.segmentRow}>
              <View style={styles.row}>
                <Skeleton
                  width={20}
                  height={20}
                  borderRadius={4}
                  style={styles.marginRight}
                />
                <Skeleton width={100} height={16} />
              </View>
              <Skeleton width={40} height={16} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  marginBottom: {
    marginBottom: 24,
  },
  marginBottomSmall: {
    marginBottom: 8,
  },
  marginRight: {
    marginRight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  flex: {
    flex: 1,
  },
  segmentedCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
