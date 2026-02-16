import { useTheme } from '@/hooks';
import { WakaTimeOrganization } from '@/interfaces/organization';
import { useOrganizationStore } from '@/stores/useOrganizationStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function OrganizationSwitcher() {
  const { theme } = useTheme();
  const { organizations, selectedOrganization, selectOrganization } =
    useOrganizationStore();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const [position, setPosition] = useState({ top: 0, right: 0, width: 0 });

  const handleOpen = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setPosition({
        top: pageY + height + 8,
        right: 16,
        width: 200,
      });
      setVisible(true);
    });
  };

  const handleSelect = (org: WakaTimeOrganization | null) => {
    selectOrganization(org);
    setVisible(false);
  };

  const currentName = selectedOrganization
    ? selectedOrganization.name
    : 'Personal';

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleOpen}
        activeOpacity={0.7}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[styles.triggerText, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {currentName}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={theme.colors.textSecondary}
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[
                  styles.menu,
                  {
                    top: position.top,
                    right: 16,
                    width: position.width,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    shadowColor: '#000',
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    !selectedOrganization && {
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  onPress={() => handleSelect(null)}
                >
                  <Text
                    style={[
                      styles.menuText,
                      {
                        color: theme.colors.text,
                        fontWeight: !selectedOrganization ? '600' : '400',
                      },
                    ]}
                  >
                    Personal
                  </Text>
                  {!selectedOrganization && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>

                {organizations.map((org) => (
                  <TouchableOpacity
                    key={org.id}
                    style={[
                      styles.menuItem,
                      selectedOrganization?.id === org.id && {
                        backgroundColor: theme.colors.background,
                      },
                    ]}
                    onPress={() => handleSelect(org)}
                  >
                    <Text
                      style={[
                        styles.menuText,
                        {
                          color: theme.colors.text,
                          fontWeight:
                            selectedOrganization?.id === org.id ? '600' : '400',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {org.name}
                    </Text>
                    {selectedOrganization?.id === org.id && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 150,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    maxHeight: 300,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
});
