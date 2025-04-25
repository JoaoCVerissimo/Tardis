import { ClientProviders } from '@/app/_providers/ClientProviders' // Import ClientProviders
import {
  FALLBACK_LOCATION,
  Theme,
  fetchWeatherCondition,
  mapConditionToTheme,
} from '@/lib/weatherUtils'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const FALLBACK_LATITUDE = FALLBACK_LOCATION.latitude
const FALLBACK_LONGITUDE = FALLBACK_LOCATION.longitude

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * Fetches weather condition server-side using fallback coordinates
 * and maps it to a theme.
 */
async function getInitialThemeServerSide(): Promise<Theme> {
  console.log(
    `Fetching initial weather condition for theme at ${FALLBACK_LATITUDE}, ${FALLBACK_LONGITUDE}...`
  )
  const condition = await fetchWeatherCondition(
    FALLBACK_LATITUDE,
    FALLBACK_LONGITUDE
  )

  const theme = mapConditionToTheme(condition)
  console.log(
    `Server determined initial theme: ${theme} (condition: ${condition ?? 'N/A'})`
  )
  return theme // Defaults to 'default' if condition is null
}

export const metadata: Metadata = {
  title: "Tardis - It's Bigger on the Inside",
  description:
    "Time And Relative Dimension In Style - A portfolio that's bigger on the inside than it appears on the outside",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialTheme = await getInitialThemeServerSide()

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      suppressHydrationWarning // Recommended when dynamically setting attributes server-side
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders initialTheme={initialTheme}>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
