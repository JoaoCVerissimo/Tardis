import { auth } from '@/app/api/auth/[...nextauth]/route'
import Navbar from '@/components/ui/Navbar'
import { SimpleWeatherWidget } from '@/components/weather-widget/simple-weather-widget'

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <div className="min-h-screen">
      <Navbar session={session} />
      <main className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">{children}</div>
      </main>
      <SimpleWeatherWidget />
    </div>
  )
}
