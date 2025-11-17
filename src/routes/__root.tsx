/// <reference types="vite/client" />
import * as React from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import Header from '@/components/Header'
import stylesUrl from '../styles.css?url'

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()

  return {
    userId,
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()

    return { userId }
  },
  head: () => ({
    title: 'Quiz Generator - Learn from Any Web Page',
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content:
          'Transform any web page into an interactive quiz. Test your knowledge and track your progress.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: stylesUrl,
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <head>
          <HeadContent />
        </head>
        <body className="bg-slate-900">
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}

declare module '@tanstack/react-router' {
  interface RootRouteContext {
    userId: string | null
  }
}
