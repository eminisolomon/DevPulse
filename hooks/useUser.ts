import { User } from '@/interfaces/user';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => wakaService.getUser(),
  });
}
