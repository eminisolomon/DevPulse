import { useTheme } from '@/hooks/useTheme';
import { createAvatar } from '@dicebear/core';
import * as personas from '@dicebear/personas';
import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
  altColor?: string;
  textColor?: string;
}

export const Avatar = ({
  source,
  initials: initialsSeed,
  size = 40,
  altColor,
}: AvatarProps) => {
  const { theme } = useTheme();

  const avatarSvg = useMemo(() => {
    if (source) return null;

    const bgColor = (altColor || theme.colors.primary).replace('#', '');

    const avatar = createAvatar(personas, {
      seed: initialsSeed || 'User',
      backgroundColor: [bgColor],
    });

    return avatar.toString();
  }, [source, initialsSeed, altColor, theme.colors.primary]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: altColor || theme.colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        avatarSvg && <SvgXml xml={avatarSvg} width={size} height={size} />
      )}
    </View>
  );
};
