import { BottomSheet } from '@/components/BottomSheet';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LogoutBottomSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutBottomSheet = forwardRef<
  BottomSheetModal,
  LogoutBottomSheetProps
>(({ onConfirm, onCancel }, ref) => {
  const { theme } = useTheme();

  return (
    <BottomSheet ref={ref} title="Logout" snapPoints={['50%']}>
      <View style={styles.logoutContent}>
        <View style={styles.logoutIconContainer}>
          <MaterialIcons name="logout" size={40} color={theme.colors.error} />
        </View>
        <Typography variant="title" weight="bold" style={styles.logoutTitle}>
          Are you sure?
        </Typography>
        <Typography
          color={theme.colors.textSecondary}
          style={styles.logoutDescription}
        >
          You will need to enter your API key again to access your stats.
        </Typography>
        <View style={styles.logoutActions}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
            onPress={onCancel}
          >
            <Typography weight="bold">CANCEL</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmLogoutButton,
              { backgroundColor: theme.colors.error },
            ]}
            onPress={onConfirm}
          >
            <Typography weight="bold" style={{ color: '#fff' }}>
              LOGOUT
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  logoutContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutTitle: {
    marginBottom: 8,
  },
  logoutDescription: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmLogoutButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
