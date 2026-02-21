import { useTheme, useUser } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../Avatar';
import { Typography } from '../Typography';

interface ShareCardWrapperProps {
  children: React.ReactNode;
  accentColor?: string;
  outerPadding?: number;
}

export const ShareCardWrapper = forwardRef<View, ShareCardWrapperProps>(
  ({ children, accentColor, outerPadding = 32 }, ref) => {
    const { theme, isDark } = useTheme();
    const { data: user } = useUser();
    const accent = accentColor || theme.colors.primary;

    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const surfaceColor = isDark ? '#1C1C1C' : '#F9F9F9';
    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#9CA3AF' : '#6B7280';

    return (
      <View
        ref={ref}
        collapsable={false}
        style={[
          styles.canvas,
          { backgroundColor: surfaceColor, padding: outerPadding },
        ]}
      >
        <LinearGradient
          colors={[accent, isDark ? '#7C3AED' : '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            {/* Header Branding */}
            <View
              style={[
                styles.header,
                { borderBottomColor: isDark ? '#262626' : '#F3F4F6' },
              ]}
            >
              <View style={styles.userRow}>
                <Avatar
                  source={
                    user?.data?.photo ? { uri: user.data.photo } : undefined
                  }
                  initials={user?.data?.display_name || user?.data?.username}
                  size={36}
                />
                <View>
                  <Typography variant="body" weight="bold" color={textColor}>
                    {user?.data?.display_name ||
                      user?.data?.username ||
                      'Developer'}
                  </Typography>
                  <Typography variant="micro" color={mutedColor}>
                    @{user?.data?.username || 'devpulse_user'}
                  </Typography>
                </View>
              </View>
              <View style={styles.headerLogo}>
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={styles.logoImage}
                />
              </View>
            </View>

            <View style={styles.content}>{children}</View>

            <View
              style={[
                styles.footer,
                { borderTopColor: isDark ? '#262626' : '#F3F4F6' },
              ]}
            >
              <View style={styles.brandContainer}>
                <Text style={[styles.brandName, { color: textColor }]}>
                  DEVPULSE
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  },
);

ShareCardWrapper.displayName = 'ShareCardWrapper';

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBorder: {
    padding: 1.5,
    borderRadius: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  card: {
    width: 400,
    borderRadius: 23,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    padding: 2,
  },
  logoImage: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 2,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
