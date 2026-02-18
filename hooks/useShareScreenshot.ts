import { toast } from '@/utilities';
import * as Sharing from 'expo-sharing';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export const useShareScreenshot = () => {
  const viewRef = useRef<View>(null);

  const handleShare = useCallback(async () => {
    try {
      if (!viewRef.current) return;

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your DevPulse stats',
      });
    } catch (error) {
      toast.error('Unable to capture screenshot. Please try again.');
    }
  }, []);

  return { viewRef, handleShare };
};
