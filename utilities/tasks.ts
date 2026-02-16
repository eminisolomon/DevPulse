import * as Notifications from 'expo-notifications';
import { getAllQuotes } from 'success-motivational-quotes';
import {
  SATURDAY_MESSAGES,
  SUNDAY_MESSAGES,
  WEEKDAY_MESSAGES,
} from '../constants/messages';

function getRandomMessage(messages: { title: string; body: string }[]): {
  title: string;
  body: string;
} {
  if (Math.random() < 0.3) {
    const externalQuotes = getAllQuotes();
    if (externalQuotes && externalQuotes.length > 0) {
      const q =
        externalQuotes[Math.floor(Math.random() * externalQuotes.length)];
      return {
        title: '🌟 Wisdom',
        body: q.quote || q.text || 'Keep pushing forward!',
      };
    }
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export async function scheduleSmartDailyReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (let day = 1; day <= 5; day++) {
      const msg = getRandomMessage(WEEKDAY_MESSAGES);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: msg.title,
          body: msg.body,
          sound: 'default',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day + 1,
          hour: 8,
          minute: 0,
        },
      });
    }

    const satMsg = getRandomMessage(SATURDAY_MESSAGES);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: satMsg.title,
        body: satMsg.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 7,
        hour: 9,
        minute: 0,
      },
    });

    const sunMsg = getRandomMessage(SUNDAY_MESSAGES);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: sunMsg.title,
        body: sunMsg.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1,
        hour: 10,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('[Notifications] Failed to schedule smart reminders:', error);
  }
}

export async function scheduleGoalReminder(
  goalTitle: string,
  targetHours: number,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Goal Milestone',
        body: `You set a goal for ${goalTitle} (${targetHours}h). Let's make it happen!`,
        sound: 'default',
        data: { type: 'goal_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 18,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('[Notifications] Failed to schedule goal reminder:', error);
  }
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] All scheduled notifications cancelled');
  } catch (error) {
    console.error(
      '[Notifications] Failed to cancel scheduled notifications:',
      error,
    );
  }
}

export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error(
      '[Notifications] Failed to get scheduled notifications:',
      error,
    );
    return [];
  }
}
