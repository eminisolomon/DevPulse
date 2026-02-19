import Icon from '@/assets/images/icon.png';
import { useTheme } from '@/hooks';
import { useUserStore } from '@/stores';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

export const InitialLoader = () => {
  const { theme } = useTheme();
  const { data: user } = useUserStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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

  const profilePic = user?.data?.photo;
  const iconSource = profilePic ? { uri: profilePic } : Icon;

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
        <Image source={iconSource} style={styles.image} resizeMode="cover" />
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
