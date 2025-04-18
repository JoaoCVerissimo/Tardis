import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react'
import { ReactElement } from 'react'

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

function render(ui: ReactElement, options: RenderOptions = {}) {
  return rtlRender(ui, {
    wrapper:
      options.wrapper ||
      ((props) => <QueryClientProvider client={queryClient} {...props} />),
  })
}

export { queryClient, render }
