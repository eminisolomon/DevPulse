import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ScreenHeaderAction {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  label?: string;
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ScreenHeaderAction[];
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenHeader = ({
  title,
  subtitle,
  actions,
  rightElement,
  style,
}: ScreenHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.colors.primary },
        styles.shadow,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <Typography
            variant="title"
            weight="bold"
            color={theme.colors.primaryForeground}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="micro"
              color={theme.colors.primaryForeground}
              style={styles.subtitle}
            >
              {subtitle}
            </Typography>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightElement}
          {actions?.map((action, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={[
                styles.iconButton,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              ]}
              onPress={action.onPress}
            >
              <MaterialCommunityIcons
                name={action.icon}
                size={20}
                color={theme.colors.primaryForeground}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 2,
    opacity: 0.9,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
