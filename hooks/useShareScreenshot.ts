import { toast } from '@/utilities';
import * as Sharing from 'expo-sharing';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export const useShareScreenshot = () => {
  const shareCardRef = useRef<View>(null);

  const handleShare = useCallback(async () => {
    try {
      if (!shareCardRef.current) {
        console.warn(
          '[Share] shareCardRef is null. Card component might not be rendered.',
        );
        toast.error('Share card not ready. Are you ranked on the leaderboard?');
        return;
      }

      const uri = await captureRef(shareCardRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your DevPulse stats',
      });
    } catch (error) {
      console.error('[Share] Screenshot capture failed:', error);
      toast.error('Unable to capture screenshot. Please try again.');
    }
  }, []);

  return {
    // State & Refs
    shareCardRef,

    // Actions
    handleShare,
  };
};
