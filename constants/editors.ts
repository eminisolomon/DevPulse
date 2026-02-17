/**
 * Mappings for Editor/IDE colors.
 */
export const EDITOR_COLORS: Record<string, string> = {
  'VS Code': '#007ACC',
  IntelliJ: '#FE315D',
  'IntelliJ IDEA': '#FE315D',
  'Android Studio': '#3DDC84',
  Xcode: '#147EFB',
  Vim: '#019733',
  NeoVim: '#57A143',
  Emacs: '#7F5AB6',
  'Sublime Text': '#FF9800',
  Atom: '#66595C',
  WebStorm: '#00CDD7',
  PyCharm: '#21D789',
  Rider: '#CF0926',
  'Visual Studio': '#5C2D91',
  'Notepad++': '#90E59A',
  Cursor: '#F54E00',
  Windsurf: '#34E8BB',
  Antigravity: '#8B5CF6',
  Chrome: '#4285F4',
  Terminal: '#4E4E4E',
  iTerm: '#4E4E4E',
  Other: '#64748B',
};

const DEFAULT_EDITOR_COLOR = '#64748B';

export const getEditorColor = (editor: string): string => {
  if (!editor) return DEFAULT_EDITOR_COLOR;

  if (
    editor.toLowerCase().includes('visual studio code') ||
    editor.toLowerCase().includes('vscode')
  ) {
    return EDITOR_COLORS['VS Code'];
  }

  return EDITOR_COLORS[editor] || DEFAULT_EDITOR_COLOR;
};
