import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'inverse-on-surface': 'hsl(var(--inverse-on-surface))',
        surface: {
          dim: 'hsl(var(--color-surface-dim))',
          bright: 'hsl(var(--color-surface-bright))',
          container: {
            lowest: 'hsl(var(--color-surface-container-lowest))',
            low: 'hsl(var(--color-surface-container-low))',
            DEFAULT: 'hsl(var(--color-surface-container))',
            high: 'hsl(var(--color-surface-container-high))',
            highest: 'hsl(var(--color-surface-container-highest))',
          },
        },
        'primary-container': 'hsl(var(--color-primary-container))',
        'on-primary-container': 'hsl(var(--color-on-primary-container))',
        'secondary-container': 'hsl(var(--color-secondary-container))',
        'on-secondary-container': 'hsl(var(--color-on-secondary-container))',
        'tertiary-container': 'hsl(var(--color-tertiary-container))',
        'on-tertiary-container': 'hsl(var(--color-on-tertiary-container))',
        'surface-variant': 'hsl(var(--color-surface-variant))',
        'on-surface-variant': 'hsl(var(--color-on-surface-variant))',
        'inverse-primary': 'hsl(var(--color-inverse-primary))',
        'inverse-surface': 'hsl(var(--color-inverse-surface))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [animate],
};

export default config;
