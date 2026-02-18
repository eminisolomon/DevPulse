import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ShareCardWrapperProps {
  children: React.ReactNode;
  accentColor?: string;
  outerPadding?: number;
}

export const ShareCardWrapper = forwardRef<View, ShareCardWrapperProps>(
  ({ children, accentColor, outerPadding = 32 }, ref) => {
    const { theme, isDark } = useTheme();
    const accent = accentColor || theme.colors.primary;

    const bgColor = isDark ? '#171717' : '#FFFFFF';
    const surfaceColor = isDark ? '#0A0A0A' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#A3A3A3' : '#666666';

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
          colors={[accent, isDark ? '#A78BFA' : '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.content}>{children}</View>

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
