import { db, schema } from '@/db';
import { sendImmediateGoalNotification } from '@/utilities/tasks';
import { wakaService } from './waka.service';

export const syncService = {
  syncGoals: async () => {
    try {
      const response = await wakaService.getGoals();
      const existingGoals = await db.select().from(schema.goals);

      for (const goal of response.data) {
        const existing = existingGoals.find((g) => g.id === goal.id);
        const { notifiedHalfway, notifiedCompleted } =
          await syncService.updateGoalMilestones(goal, existing);

        await syncService.persistGoal(goal, notifiedHalfway, notifiedCompleted);
      }
      return { success: true };
    } catch (error) {
      console.error('Goal sync error:', error);
      return { success: false, error };
    }
  },

  updateGoalMilestones: async (goal: any, existing: any) => {
    const targetSeconds =
      goal.chart_data?.[goal.chart_data.length - 1]?.goal_seconds || 0;
    const progress = targetSeconds > 0 ? goal.seconds / targetSeconds : 0;

    let notifiedHalfway = existing?.notifiedHalfway || false;
    let notifiedCompleted = existing?.notifiedCompleted || false;

    if (progress >= 0.5 && !notifiedHalfway && progress < 1) {
      await sendImmediateGoalNotification(
        '🔥 Halfway There!',
        `You're 50% through your "${goal.title}" goal. Keep it up!`,
      );
      notifiedHalfway = true;
    }

    if (goal.status === 'success' && !notifiedCompleted) {
      await sendImmediateGoalNotification(
        '🏆 Goal Completed!',
        `Congratulation! You've crushed your "${goal.title}" goal.`,
      );
      notifiedCompleted = true;
    }

    if (existing && existing.rangeText !== goal.range_text) {
      notifiedHalfway = false;
      notifiedCompleted = false;
    }

    return { notifiedHalfway, notifiedCompleted };
  },

  persistGoal: async (
    goal: any,
    notifiedHalfway: boolean,
    notifiedCompleted: boolean,
  ) => {
    await db
      .insert(schema.goals)
      .values({
        id: goal.id,
        title: goal.title,
        status: goal.status,
        seconds: goal.seconds,
        improvementStatus: goal.improvement_status,
        isEnabled: goal.is_enabled,
        notifiedHalfway,
        notifiedCompleted,
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
          notifiedHalfway,
          notifiedCompleted,
          rangeText: goal.range_text,
          chartData: JSON.stringify(goal.chart_data),
          languages: JSON.stringify(goal.languages),
          lastSyncedAt: new Date(),
        },
      });
  },
};
