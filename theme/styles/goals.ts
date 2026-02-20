import { StyleSheet } from 'react-native';
import { spacing } from '../spacing';
import { tokens } from '../tokens';
import { commonStyles } from './common';

export const goalsStyles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  center: {
    ...commonStyles.center,
  },
  listContent: {
    padding: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: 100,
  },
  goalCard: {
    marginBottom: spacing[4],
    padding: spacing[4],
  },
  goalHeader: {
    ...commonStyles.row,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  titleContainer: {
    ...commonStyles.flex1,
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: tokens.borderRadius.sm,
    marginLeft: spacing[3],
  },
  progressSection: {
    marginBottom: spacing[4],
  },
  progressInfo: {
    ...commonStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressBarBg: {
    height: 8,
    borderRadius: tokens.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: tokens.borderRadius.full,
  },
  footer: {
    ...commonStyles.row,
    justifyContent: 'space-between',
    paddingTop: spacing[3],
    borderTopWidth: 1,
  },
  emptyState: {
    ...commonStyles.center,
    padding: spacing[10],
    marginTop: spacing[10],
  },
  emptyTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
