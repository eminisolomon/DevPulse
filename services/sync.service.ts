import { db, schema } from '@/db';
import { wakaService } from './waka.service';

export const syncService = {
  syncGoals: async () => {
    try {
      const response = await wakaService.getGoals();

      for (const goal of response.data) {
        await db
          .insert(schema.goals)
          .values({
            id: goal.id,
            title: goal.title,
            status: goal.status,
            seconds: goal.seconds,
            improvementStatus: goal.improvement_status,
            isEnabled: goal.is_enabled,
            rangeText: goal.range_text,
            chartData: JSON.stringify(goal.chart_data),
            languages: JSON.stringify(goal.languages),
            lastSyncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.goals.id,
            set: {
              title: goal.title,
              status: goal.status,
              seconds: goal.seconds,
              improvementStatus: goal.improvement_status,
              isEnabled: goal.is_enabled,
              rangeText: goal.range_text,
              chartData: JSON.stringify(goal.chart_data),
              languages: JSON.stringify(goal.languages),
              lastSyncedAt: new Date(),
            },
          });
      }
      return { success: true };
    } catch (error) {
      console.error('Goal sync error:', error);
      return { success: false, error };
    }
  },
};
