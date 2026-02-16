import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function setupAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#366bd6',
      sound: 'default',
    });
  }
}

function handleRegistrationError(errorMessage: string): void {
  console.error('[Notifications]', errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  await setupAndroidNotificationChannel();

  if (!Device.isDevice) {
    console.warn(
      '[Notifications] Push notifications require a physical device.',
    );
    return undefined;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn(
      '[Notifications] Permission not granted for push notifications.',
    );
    return undefined;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    handleRegistrationError('Project ID not found in Expo config.');
    return undefined;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } catch (error: unknown) {
    handleRegistrationError(`Failed to get push token: ${error}`);
    return undefined;
  }
}

export function getDeviceInfo(): {
  deviceId: string;
  name: string | null;
  platform: string;
  osVersion: string | null;
} {
  return {
    deviceId:
      Device.osBuildId || Device.modelId || `${Platform.OS}-${Date.now()}`,
    name: Device.deviceName,
    platform: Platform.OS,
    osVersion: Device.osVersion,
  };
}
