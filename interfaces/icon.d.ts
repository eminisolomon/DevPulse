import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

declare global {
  type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
  type IconName = keyof typeof MaterialIcons.glyphMap;
  type IoniconName = keyof typeof Ionicons.glyphMap;
}
