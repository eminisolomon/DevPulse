import { wakaService } from '@/services/waka.service';
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
    return languageColors[name] || '#6e7681';
  };

  const getEditorColor = (name: string) => {
    if (!name) return '#64748B';

    // Check for VS Code variants
    if (
      name.toLowerCase().includes('visual studio code') ||
      name.toLowerCase().includes('vscode')
    ) {
      return editorColors['VS Code'] || '#007ACC';
    }

    return editorColors[name] || '#64748B';
  };

  return {
    languageColors,
    editorColors,
    getLanguageColor,
    getEditorColor,
    isLoading: languagesQuery.isLoading || editorsQuery.isLoading,
    languages: languagesQuery.data?.data || [],
    editors: editorsQuery.data?.data || [],
  };
}
