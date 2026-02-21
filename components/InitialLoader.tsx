import Icon from '@/assets/images/icon.png';
import { useTheme, useUser } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { Image } from 'expo-image';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const InitialLoader = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user: persistedUser } = useAuthStore();
  const { data: user } = useUser();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const image = isAuthenticated && (user?.data?.photo || persistedUser?.photo);
  const iconSource = image ? { uri: image } : Icon;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Animated.View
        style={[
          styles.imageContainer,
          {
            borderColor: theme.colors.surfaceHighlight,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Image
          source={iconSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
