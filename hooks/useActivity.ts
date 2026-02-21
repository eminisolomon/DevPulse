import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useActivity(date: string) {
  const query = useQuery({
    queryKey: ['heartbeats', date],
    queryFn: () => wakaService.getHeartbeats(date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!date,
  });

  const stats = useMemo(() => {
    if (!query.data?.data) return null;

    let aiLines = 0;
    let humanLines = 0;
    const projectActivity: Record<string, { ai: number; human: number }> = {};

    query.data.data.forEach((heartbeat) => {
      const ai = heartbeat.ai_line_changes || 0;
      const human = heartbeat.human_line_changes || 0;

      aiLines += ai;
      humanLines += human;

      if (heartbeat.project) {
        if (!projectActivity[heartbeat.project]) {
          projectActivity[heartbeat.project] = { ai: 0, human: 0 };
        }
        projectActivity[heartbeat.project].ai += ai;
        projectActivity[heartbeat.project].human += human;
      }
    });

    const totalLines = aiLines + humanLines;
    const aiPercent = totalLines > 0 ? (aiLines / totalLines) * 100 : 0;
    const humanPercent = totalLines > 0 ? (humanLines / totalLines) * 100 : 0;

    return {
      aiLines,
      humanLines,
      totalLines,
      aiPercent,
      humanPercent,
      projectActivity,
    };
  }, [query.data]);

  return {
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
    data: query.data?.data || [],
  };
}
