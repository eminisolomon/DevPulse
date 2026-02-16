import { useOrganizationStore } from '@/stores/useOrganizationStore';
import { useSummariesStore } from '@/stores/useSummariesStore';
import { format } from 'date-fns';
import { useEffect } from 'react';

export function useSummaries(start: Date, end: Date) {
  const { data, isLoading, error, fetchSummaries } = useSummariesStore();
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;
  const startStr = format(start, 'yyyy-MM-dd');
  const endStr = format(end, 'yyyy-MM-dd');
  const key = orgId
    ? `${startStr}_${endStr}_${orgId}`
    : `${startStr}_${endStr}`;

  useEffect(() => {
    fetchSummaries(start, end, orgId);
  }, [key, fetchSummaries, startStr, endStr, orgId]);

  return {
    data: data[key] || undefined,
    isLoading,
    error,
    refetch: () => fetchSummaries(start, end, orgId),
    isRefetching: isLoading,
  };
}
