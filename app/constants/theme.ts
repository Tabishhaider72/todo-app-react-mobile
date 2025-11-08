/**
 * Modern black-and-white theme — minimal and clean for your todo app prototype.
 * Includes unified placeholder, border, and button shades for consistent UI.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B0B0B', // near-true black
    background: '#F8F9FA', // modern soft white
    tint: '#0B0B0B', // primary tint
    icon: '#2C2C2C',
    tabIconDefault: '#9B9B9B',
    tabIconSelected: '#0B0B0B',
  },
  dark: {
    text: '#F8F9FA',
    background: '#0B0B0B',
    tint: '#F8F9FA',
    icon: '#D9D9D9',
    tabIconDefault: '#7A7A7A',
    tabIconSelected: '#F8F9FA',
  },

  // 👇 global utility colors used across both modes
  placeholder: '#9B9B9B', // for TextInput placeholder
  border: '#E6E6E6', // light neutral border
  muted: '#B0B0B0', // muted labels/text
  button: '#0B0B0B', // default button color (black tint)
  buttonText: '#FFFFFF', // button text color
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
