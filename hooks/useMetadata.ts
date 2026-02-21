import { wakaService } from '@/services/waka.service';
import { generateDeterministicColor } from '@/utilities/colors';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useMetadata() {
  const languagesQuery = useQuery({
    queryKey: ['languages'],
    queryFn: () => wakaService.getProgramLanguages(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const editorsQuery = useQuery({
    queryKey: ['editors'],
    queryFn: () => wakaService.getEditors(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const machinesQuery = useQuery({
    queryKey: ['machines'],
    queryFn: () => wakaService.getMachineNames(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const languageColors = useMemo(() => {
    const apiColors: Record<string, string> = {};
    languagesQuery.data?.data.forEach((lang) => {
      if (lang.color) {
        apiColors[lang.name] = lang.color;
      }
    });
    return apiColors;
  }, [languagesQuery.data]);

  const editorColors = useMemo(() => {
    const apiColors: Record<string, string> = {};
    editorsQuery.data?.data.forEach((editor) => {
      if (editor.color) {
        apiColors[editor.name] = editor.color;
      }
    });
    return apiColors;
  }, [editorsQuery.data]);

  const getLanguageColor = (name: string) => {
    return languageColors[name] || generateDeterministicColor(name);
  };

  const getEditorColor = (name: string) => {
    if (!name) return '#64748B';

    const lowerName = name.toLowerCase();
    if (
      lowerName.includes('visual studio code') ||
      lowerName.includes('vscode')
    ) {
      return editorColors['VS Code'] || '#007ACC';
    }

    return editorColors[name] || generateDeterministicColor(name);
  };

  const getMachineColor = (machine_name_id?: string) => {
    if (!machine_name_id) return '#64748B';
    return generateDeterministicColor(machine_name_id);
  };

  const getWorkstationMetadata = (machine_name_id: string) => {
    return machinesQuery.data?.data.find((m) => m.id === machine_name_id);
  };

  return {
    languageColors,
    editorColors,
    getLanguageColor,
    getEditorColor,
    getMachineColor,
    getWorkstationMetadata,
    isLoading:
      languagesQuery.isLoading ||
      editorsQuery.isLoading ||
      machinesQuery.isLoading,
    languages: languagesQuery.data?.data || [],
    editors: editorsQuery.data?.data || [],
    machines: machinesQuery.data?.data || [],
  };
}
