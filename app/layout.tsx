import { Head } from 'nextra/components'
import './globals.css'

export const metadata = {
  title: 'Jens Fischer'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>{children}</body>
    </html>
  )
}
