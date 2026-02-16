import { useUserStore } from '@/stores';
import { useEffect } from 'react';

export function useUser() {
  const { data, isLoading, error, fetchUser } = useUserStore();

  useEffect(() => {
    if (!data) {
      fetchUser();
    }
  }, [data, fetchUser]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
