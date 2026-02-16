import { BottomSheet, Card } from '@/components';
import { Avatar } from '@/components/Avatar';
import { Typography } from '@/components/Typography';
import { useTheme, useUser } from '@/hooks';
import { settingsService } from '@/services/settings.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
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

  const ACCENT_COLORS = [
    { name: 'Deep Blue', color: '#3B82F6' },
    { name: 'Royal Purple', color: '#8B5CF6' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Crimson', color: '#EF4444' },
    { name: 'Amber', color: '#F59E0B' },
    { name: 'Rose', color: '#F43F5E' },
    { name: 'Indigo', color: '#6366F1' },
    { name: 'Slate', color: '#475569' },
  ];

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

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    isSwitch,
    switchValue,
    onSwitchChange,
    color,
    description,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: (color || theme.colors.primary) + '15' },
        ]}
      >
        <Feather name={icon} size={20} color={color || theme.colors.primary} />
      </View>
      <View style={styles.settingText}>
        <Typography weight="medium">{label}</Typography>
        {description && (
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {description}
          </Typography>
        )}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surface}
        />
      ) : (
        <View style={styles.settingValue}>
          {value && (
            <Typography
              variant="caption"
              color={theme.colors.textSecondary}
              style={{ marginRight: 8 }}
            >
              {value}
            </Typography>
          )}
          <Feather
            name="chevron-right"
            size={18}
            color={theme.colors.textSecondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Typography
      variant="micro"
      weight="bold"
      color={theme.colors.textSecondary}
      style={styles.sectionHeader}
    >
      {title.toUpperCase()}
    </Typography>
  );

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

        <BottomSheet
          ref={logoutBottomSheetRef}
          title="Logout"
          snapPoints={['50%']}
        >
          <View style={styles.logoutContent}>
            <View style={styles.logoutIconContainer}>
              <MaterialIcons
                name="logout"
                size={40}
                color={theme.colors.error}
              />
            </View>
            <Typography
              variant="title"
              weight="bold"
              style={styles.logoutTitle}
            >
              Are you sure?
            </Typography>
            <Typography
              color={theme.colors.textSecondary}
              style={styles.logoutDescription}
            >
              You will need to enter your API key again to access your stats.
            </Typography>
            <View style={styles.logoutActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => logoutBottomSheetRef.current?.dismiss()}
              >
                <Typography weight="bold">CANCEL</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmLogoutButton,
                  { backgroundColor: theme.colors.error },
                ]}
                onPress={confirmLogout}
              >
                <Typography weight="bold" style={{ color: '#fff' }}>
                  LOGOUT
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
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
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionCard: {
    padding: 4,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutTitle: {
    marginBottom: 8,
  },
  logoutDescription: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmLogoutButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
