import { StyleSheet } from 'react-native';
import { spacing } from '../spacing';
import { tokens } from '../tokens';
import { commonStyles } from './common';

export const projectsStyles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  center: {
    ...commonStyles.center,
  },
  listContent: {
    padding: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: 40,
  },
  footerLoader: {
    paddingVertical: spacing[5],
    ...commonStyles.center,
  },
  emptyState: {
    ...commonStyles.center,
    padding: spacing[10],
    marginTop: spacing[10],
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: tokens.borderRadius.full,
    ...commonStyles.center,
    marginBottom: spacing[5],
  },
  emptyTitle: {
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 250,
  },
  searchContainer: {
    ...commonStyles.row,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[4],
    borderRadius: tokens.borderRadius.sm,
    marginBottom: spacing[2],
  },
  searchIcon: {
    marginRight: spacing[2],
  },
  searchInput: {
    ...commonStyles.flex1,
    fontSize: 16,
    height: 24,
    padding: 0,
  },
});

export const projectDetailStyles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  center: {
    ...commonStyles.center,
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: 40,
  },
  allTimeCard: {
    marginBottom: spacing[5],
  },
  statsGrid: {
    ...commonStyles.row,
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statCard: {
    ...commonStyles.flex1,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    marginBottom: spacing[3],
  },
  chartCard: {
    padding: spacing[4],
    minHeight: 280,
    ...commonStyles.center,
  },
  listCard: {
    padding: spacing[2],
  },
  listItem: {
    ...commonStyles.row,
    justifyContent: 'space-between',
    padding: spacing[3],
    borderBottomWidth: 1,
  },
  noData: {
    textAlign: 'center',
    paddingVertical: spacing[10],
  },
});
