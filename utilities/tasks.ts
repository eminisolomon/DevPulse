import * as Notifications from 'expo-notifications';

const MORNING_MESSAGES = [
  {
    title: '🚗 Good Morning!',
    body: 'Start your day by checking out the latest car deals on XDrive.',
  },
  {
    title: '🔧 Time for a Check-up?',
    body: 'Find trusted mechanics near you and keep your car running smoothly.',
  },
  {
    title: '🏎️ Swap Your Ride!',
    body: 'Explore amazing car swap opportunities on XDrive today.',
  },
  {
    title: '⭐ New Listings Await!',
    body: 'Check out fresh car listings that just dropped on XDrive.',
  },
  {
    title: '🛠️ Workshop Discovery',
    body: 'Discover top-rated workshops in your area for all your car needs.',
  },
  {
    title: '💰 Great Deals Today!',
    body: "Don't miss out on today's best car offers on XDrive.",
  },
  {
    title: '🚘 Your Dream Car Awaits',
    body: 'Browse through hundreds of cars and find your perfect match.',
  },
];

function getRandomMorningMessage(): { title: string; body: string } {
  const randomIndex = Math.floor(Math.random() * MORNING_MESSAGES.length);
  return MORNING_MESSAGES[randomIndex];
}

export async function scheduleDailyMorningNotification(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const message = getRandomMorningMessage();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });
  } catch (error) {
    console.error(
      '[Notifications] Failed to schedule daily notification:',
      error,
    );
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
