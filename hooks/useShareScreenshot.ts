import { telemetryService } from '@/services';
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
        telemetryService.track('share_failed', {
          reason: 'share_card_ref_missing',
        });
        toast.error('Share card not ready yet. Please try again.');
        return;
      }

      telemetryService.track('share_started', { format: 'png' });

      const uri = await captureRef(shareCardRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your DevPulse stats',
      });

      telemetryService.track('share_completed', { format: 'png' });
    } catch (error) {
      console.error('[Share] Screenshot capture failed:', error);
      telemetryService.captureException(error, {
        area: 'share_screenshot',
      });
      telemetryService.track('share_failed', { reason: 'capture_failed' });
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
