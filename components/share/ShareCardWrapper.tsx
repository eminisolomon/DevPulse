import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ShareCardWrapperProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const ShareCardWrapper = forwardRef<View, ShareCardWrapperProps>(
  ({ children, accentColor }, ref) => {
    const { theme, isDark } = useTheme();
    const accent = accentColor || theme.colors.primary;

    const bgColor = isDark ? '#0F0F0F' : '#FFFFFF';
    const surfaceColor = isDark ? '#1A1A1A' : '#F8F9FA';
    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#888888' : '#666666';

    return (
      <View
        ref={ref}
        collapsable={false}
        style={[styles.card, { backgroundColor: bgColor }]}
      >
        {/* Top accent bar */}
        <LinearGradient
          colors={[accent, isDark ? '#A78BFA' : '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Footer branding */}
        <View
          style={[
            styles.footer,
            { borderTopColor: isDark ? '#222' : '#EBEBEB' },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={[styles.logoIcon, { backgroundColor: accent }]}>
              <Feather name="activity" size={12} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandName, { color: textColor }]}>
              DevPulse
            </Text>
          </View>
          <Text style={[styles.watermark, { color: mutedColor }]}>
            devpulse.app
          </Text>
        </View>
      </View>
    );
  },
);

ShareCardWrapper.displayName = 'ShareCardWrapper';

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    width: 380,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  accentBar: {
    height: 5,
    width: '100%',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  watermark: {
    fontSize: 12,
    fontWeight: '500',
  },
});
