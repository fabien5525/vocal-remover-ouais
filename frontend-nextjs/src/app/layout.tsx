import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List',
  description: 'List of musics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-500">{children}</body>
    </html>
  )
}
