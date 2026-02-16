/**
 * Utility for mapping programming languages to their representative colors.
 * Standard colors derived from GitHub, SimpleIcons, and language specifications.
 */

export const LANGUAGE_COLORS: Record<string, string> = {
  // Web & Frontend
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  TSX: '#3178c6',
  JSX: '#f1e05a',
  React: '#61dafb',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Sass: '#cf649a',
  SCSS: '#cf649a',
  Less: '#1d365d',
  Vue: '#41b883',
  Angular: '#dd0031',
  NextJS: '#000000',
  Tailwind: '#38bdf8',
  PostCSS: '#d22128',
  Stylus: '#ff6347',
  'Vue-Dot-Net': '#41b883',

  // Backend & Systems
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  CPP: '#f34b7d',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  'C#': '#178600',
  C: '#555555',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Erlang: '#b83998',
  Elixir: '#6e4a7e',
  Zig: '#ec915c',
  Nim: '#ffc200',
  Crystal: '#000100',
  Julia: '#a270ba',
  Fortran: '#4d41b1',
  COBOL: '#53565a',
  Pascal: '#E3F171',
  Assembly: '#6E4C13',

  // Mobile & Cross-Platform
  Dart: '#00B4AB',
  Flutter: '#02569B',
  'Objective-C': '#438eff',
  'Objective-C++': '#438eff',

  // Data, SQL & Math
  R: '#276DC3',
  SQL: '#e38c00',
  PLSQL: '#e38c00',
  PostgreSQL: '#336791',
  MySQL: '#4479a1',
  MongoDB: '#47A248',
  Redis: '#D82C20',
  MATLAB: '#e16737',

  // Scripting & Automation
  Shell: '#89e051',
  Bash: '#89e051',
  PowerShell: '#012456',
  Lua: '#000080',
  Perl: '#0298c3',
  Tcl: '#e4cc98',
  Batchfile: '#C1F12E',
  Makefile: '#427819',
  CMake: '#064F8C',

  // Config, Data & Docs
  JSON: '#292929',
  JSON5: '#292929',
  YAML: '#cb171e',
  Markdown: '#083fa1',
  Text: '#6a737d',
  XML: '#0060ac',
  SVG: '#ff9900',
  'Git Config': '#F1502F',
  TSConfig: '#3178c6',
  Dockerfile: '#384d54',
  Terraform: '#7B42BC',
  GraphQL: '#e10098',
  Prisma: '#0c344b',
  toml: '#9c4221',
  ini: '#d1d1d1',

  // Other & Specialized
  Solidity: '#AA6746',
  WebAssembly: '#654ff0',
  Astro: '#ff5d01',
  Svelte: '#ff3e00',
  Arduino: '#00979D',
};

const DEFAULT_COLOR = '#6e7681';

/**
 * Get the color for a programming language.
 * Returns a default gray color if the language is not mapped.
 */
export const getLanguageColor = (languageName: string): string => {
  if (!languageName) return DEFAULT_COLOR;
  return LANGUAGE_COLORS[languageName] || DEFAULT_COLOR;
};
