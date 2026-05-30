import './globals.css'

export const metadata = {
  title: 'PlayDay - Topeka Park Vibe Check',
  description: 'Find the perfect Topeka park for your current vibe.',
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
