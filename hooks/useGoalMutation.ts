import { WakaTimeGoal } from '@/interfaces';
import { wakaService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useGoalMutation() {
  const queryClient = useQueryClient();

  const createGoal = useMutation({
    mutationFn: (data: Partial<WakaTimeGoal>) => wakaService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WakaTimeGoal> }) =>
      wakaService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: (id: string) => wakaService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    // Actions
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
