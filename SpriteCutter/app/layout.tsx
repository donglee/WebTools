import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sprite Cutter - Professional Image Cropping Tool',
  description: 'A professional image cropping tool with drag-and-drop adjustment, auto-centering, and precise cropping features.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  )
}