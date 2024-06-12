import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
        serif: ['var(--font-f1-wide)', ...fontFamily.serif],
        mono: ['var(--font-f1-regular)', ...fontFamily.mono]
      }
    }
  }
}
export default config
