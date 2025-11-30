import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LOL Interface Clone',
  description: 'League of Legends Interface Clone',
}

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className={inter.className }>
        <Providers>
          {children}
        </Providers>
      </body>
      <link rel="icon" href="/favicon.png" />
    </html>
  )
}
