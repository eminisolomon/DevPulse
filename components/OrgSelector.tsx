import { Select, SelectOption } from '@/components/Select';
import { useTheme } from '@/hooks/useTheme';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OrgSelectorProps {
  onSelect: (orgId: string | null) => void;
  selectedOrgId: string | null;
}

export const OrgSelector = ({ onSelect, selectedOrgId }: OrgSelectorProps) => {
  const { theme } = useTheme();

  const { data: orgsData, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => wakaService.getOrganizations(),
  });

  const options: SelectOption[] = [
    { label: 'All Personal', value: null as unknown as string },
    ...(orgsData?.data || []).map((org: any) => ({
      label: org.name,
      value: org.id,
    })),
  ];

  return (
    <View style={styles.container}>
      <Select
        label="Organization"
        value={selectedOrgId as any}
        options={options}
        onSelect={(val) => onSelect(val === 'null' ? null : (val as any))}
        title="Select Organization"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
