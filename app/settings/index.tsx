import { Avatar, Card, Typography } from '@/components';
import { ACCENT_COLORS } from '@/constants';
import {
  LogoutBottomSheet,
  SectionHeader,
  SettingItem,
} from '@/features/settings';
import { useTheme, useUser } from '@/hooks';
import { settingsService } from '@/services';
import { useAuthStore } from '@/stores';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme, themeMode, accentColor } = useTheme();
  const { data: user } = useUser();
  const { logout } = useAuthStore();
  const router = useRouter();
  const logoutBottomSheetRef = useRef<BottomSheetModal>(null);

  const [settingsState, setSettingsState] = React.useState({
    collectCrashes: true,
    collectPerformance: true,
    collectAnalytics: true,
  });

  React.useEffect(() => {
    const loadSettings = async () => {
      const s = await settingsService.getSettings();
      setSettingsState({
        collectCrashes: s.collectCrashes,
        collectPerformance: s.collectPerformance,
        collectAnalytics: s.collectAnalytics,
      });
    };
    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof typeof settingsState) => {
    const newValue = !settingsState[key];
    setSettingsState((prev) => ({ ...prev, [key]: newValue }));
    await settingsService.updateSettings({ [key]: newValue });
  };

  const currentAccentName =
    ACCENT_COLORS.find((c) => c.color === accentColor)?.name || 'Custom';
  const currentModeLabel =
    themeMode.charAt(0).toUpperCase() + themeMode.slice(1);

  const handleLogout = () => {
    logoutBottomSheetRef.current?.present();
  };

  const confirmLogout = () => {
    logoutBottomSheetRef.current?.dismiss();
    logout();
    router.replace('/');
  };

  const userData = user?.data;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Avatar
              source={userData?.photo ? { uri: userData.photo } : undefined}
              initials={userData?.display_name || userData?.username}
              size={90}
            />
            <View style={{ height: 12 }} />
            <Typography variant="title" weight="bold" style={styles.userName}>
              {userData?.display_name || userData?.username || 'Developer'}
            </Typography>
            <Typography color={theme.colors.textSecondary} variant="body">
              Software Engineer
            </Typography>
            <View style={styles.locationContainer}>
              <Feather
                name="map-pin"
                size={12}
                color={theme.colors.textTertiary}
              />
              <Typography
                variant="caption"
                color={theme.colors.textTertiary}
                style={{ marginLeft: 4 }}
              >
                {(userData as any)?.city?.name || 'World'}
              </Typography>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <SectionHeader title="About" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="star"
            label="Rate The App"
            description="Support development with a review"
          />
          <SettingItem
            icon="coffee"
            label="Buy Me A Coffee"
            description="Every cup fuels more features"
            onPress={() =>
              Linking.openURL('https://buymeacoffee.com/eminisolomon')
            }
          />
          <SettingItem
            icon="help-circle"
            label="Who even made this?"
            description="Meet the developer behind DevPulse"
            onPress={() =>
              Linking.openURL('https://solomon-olatunji.vercel.app/')
            }
          />
        </Card>

        {/* Activity & Stats Section */}
        <SectionHeader title="Activity & Stats" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="bar-chart-2"
            label="Coding Stats"
            description="Detailed analytics and charts"
            onPress={() => router.push('/stats/numbers' as any)}
          />
          <SettingItem
            icon="clock"
            label="Session History"
            description="Daily session activity timeline"
            onPress={() => router.push('/stats/sessions' as any)}
          />
        </Card>

        {/* Theming Section */}
        <SectionHeader title="Theming" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="edit-2"
            label="Appearance"
            value={`${currentModeLabel} • ${currentAccentName}`}
            onPress={() => router.push('/settings/theme')}
          />
        </Card>

        {/* Insights Section */}
        <SectionHeader title="Insights" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="alert-circle"
            label="Crashes"
            description="Collect log information about bugs and crashes."
            isSwitch
            switchValue={settingsState.collectCrashes}
            onSwitchChange={() => toggleSetting('collectCrashes')}
          />
          <SettingItem
            icon="activity"
            label="Performance"
            description="Collect log information about hiccups, load speeds."
            isSwitch
            switchValue={settingsState.collectPerformance}
            onSwitchChange={() => toggleSetting('collectPerformance')}
          />
          <SettingItem
            icon="mouse-pointer"
            label="Analytics"
            description="Anonymously collect info about app usage."
            isSwitch
            switchValue={settingsState.collectAnalytics}
            onSwitchChange={() => toggleSetting('collectAnalytics')}
          />
        </Card>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FACC15' }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#000" />
          <Typography weight="bold" style={{ color: '#000', marginLeft: 12 }}>
            LOGOUT
          </Typography>
        </TouchableOpacity>

        <LogoutBottomSheet
          ref={logoutBottomSheetRef}
          onConfirm={confirmLogout}
          onCancel={() => logoutBottomSheetRef.current?.dismiss()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionCard: {
    padding: 4,
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
  },
});
