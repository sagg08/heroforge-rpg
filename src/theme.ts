import { Platform } from 'react-native';

/** Paleta y tokens visuales compartidos (tema oscuro RPG). */
export const colors = {
  background: '#0b1020',
  surface: '#141b2d',
  surfaceAlt: '#1c2540',
  border: '#2a3555',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  gold: '#fbbf24',
  hp: '#ef4444',
  mana: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#dc2626',
  str: '#f87171',
  agi: '#34d399',
  int: '#60a5fa',
  console: '#05070d',
  consoleText: '#a3e635',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16 } as const;

export const radius = { sm: 6, md: 10, lg: 16 } as const;

/** Fuente monoespaciada para la consola de Redux. */
export const monoFont = Platform.select({ ios: 'Menlo', default: 'monospace' });
