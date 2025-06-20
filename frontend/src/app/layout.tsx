// src/app/layout.tsx - Simplified Layout
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knowledge Base Builder',
  description: 'Learn anything with interactive mindmaps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
