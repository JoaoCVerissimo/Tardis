import Navbar from '@/components/ui/Navbar'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">{children}</div>
      </main>
    </div>
  )
}
