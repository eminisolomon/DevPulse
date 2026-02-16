import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { WakaTimeProject } from '@/interfaces/project';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProjectCardProps {
  item: WakaTimeProject;
}

export const ProjectCard = ({ item }: ProjectCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const projectColor = item.color || theme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/project/${item.urlencoded_name}`)}
    >
      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: projectColor + '15' },
            ]}
          >
            <Feather name="code" size={18} color={projectColor} />
          </View>

          <View style={styles.projectMainInfo}>
            <View style={styles.nameRow}>
              <Typography variant="body" weight="bold" numberOfLines={1}>
                {item.name}
              </Typography>
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: projectColor },
                ]}
              />
            </View>

            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              style={styles.lastActiveText}
            >
              Last active: {item.human_readable_last_heartbeat_at || 'Never'}
            </Typography>

            {item.repository && (
              <View style={styles.repoInfo}>
                <Feather
                  name="github"
                  size={12}
                  color={theme.colors.textSecondary}
                />
                <Typography
                  variant="micro"
                  color={theme.colors.textSecondary}
                  style={styles.repoText}
                  numberOfLines={1}
                >
                  {item.repository.html_url.split('/').pop()}
                </Typography>
              </View>
            )}
          </View>

          <View style={styles.projectStats}>
            <Feather
              name="chevron-right"
              size={18}
              color={theme.colors.border}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectMainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  colorIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
  repoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  projectStats: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  lastActiveText: {
    marginTop: -2,
    marginBottom: 6,
    opacity: 0.8,
  },
});
