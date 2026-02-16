import { useAllTimeStore } from '@/stores/useAllTimeStore';
import { useEffect } from 'react';

export function useAllTime() {
  const { data, isLoading, error, fetchAllTime } = useAllTimeStore();

  useEffect(() => {
    if (!data) {
      fetchAllTime();
    }
  }, [data, fetchAllTime]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchAllTime(true),
  };
}
