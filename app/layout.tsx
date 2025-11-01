import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InternHub Portal - Find Your Dream Internship',
  description: 'Connecting top talent with exciting opportunities. Your next career move starts here.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

