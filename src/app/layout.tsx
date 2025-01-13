import '@/app/globals.css'

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'

import { Header } from '@/components/navigation/header'
import { Menu } from '@/components/navigation/slide-menu'

import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
})

const f1Regular = localFont({
  src: [
    {
      path: '../../public/fonts/formula1-regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/formula1-bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-f1-regular'
})

const f1Wide = localFont({
  src: [
    {
      path: '../../public/fonts/formula1-wide.woff2',
      weight: '400',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-f1-wide'
})

export const metadata: Metadata = {
  title: 'GP Rivals',
  description: 'Compare the performance of F1 teammates throughout a season.'
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          spaceGrotesk.variable,
          f1Regular.variable,
          f1Wide.variable,
          'mb-10 bg-zinc-950 font-sans text-zinc-50'
        )}
      >
        <Menu />
        <main>{children}</main>
      </body>
    </html>
  )
}
