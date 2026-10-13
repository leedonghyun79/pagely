import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/marketing'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Pagely',
  description: '채팅으로 만들고 고치는 AI 웹빌더',
  openGraph: { siteName: 'Pagely', locale: 'ko_KR', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
