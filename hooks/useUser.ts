import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
  });
}
