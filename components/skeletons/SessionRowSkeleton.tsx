import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const SessionRowSkeleton = () => {
  return (
    <View style={styles.card}>
      <Skeleton
        width={120}
        height={20}
        style={{ marginBottom: 12, marginLeft: 8 }}
      />
      <Skeleton width="100%" height={60} borderRadius={12} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});
