import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

declare global {
  type FeatherIconName = keyof typeof Feather.glyphMap;
  type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
  type IconName = keyof typeof MaterialIcons.glyphMap;
  type IoniconName = keyof typeof Ionicons.glyphMap;
}
