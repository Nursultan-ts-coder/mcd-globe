import * as React from 'react'
import { useErrorBoundary } from 'use-error-boundary'
import { Route } from 'wouter'
import Globe from './components/Globe/Globe'
import { Loading, Page } from './components'
import './styles.css'

function ErrorBoundary({ children, fallback, name }: any) {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  return didCatch ? fallback(error) : <ErrorBoundary key={name}>{children}</ErrorBoundary>
}

export default function App() {
  return (
    <Page>
      <React.Suspense fallback={<Loading />}>
        <Route path="/">
          <Globe />
        </Route>
      </React.Suspense>
    </Page>
  )
}
