import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: {
    files: [
      './src/**/*.{astro,html,js,jsx,ts,tsx,css}',
      './public/**/*.html',
    ],
  },
  corePlugins: {
    preflight: false, // resetしないならfalse（グローバルCSSと競合対策）
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'Manrope', 'Recursive', 'Noto Sans JP', 'sans-serif'],
        mono: ['Recursive', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: null,
            'pre::before': null,
            'pre::after': null,
            code: null,
            'code::before': null,
            'code::after': null,
            'pre code': null,
            'pre code::before': null,
            'pre code::after': null,
          },
        },
      },
    },
  },
  experimental: {
    optimizeUniversalDefaults: true, // ✅ パフォーマンス改善
  },
  plugins: [typography],
};

export default config;
