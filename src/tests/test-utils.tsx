import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

interface RenderOptions {
  wrapper?: React.ComponentType
}

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}

function render(ui: ReactElement, options: RenderOptions = {}) {
  // Use AllTheProviders as the default wrapper, unless a specific one is provided
  return rtlRender(ui, {
    wrapper: options.wrapper || AllTheProviders,
    ...options,
  })
}

export { queryClient, render }
