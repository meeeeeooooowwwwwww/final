import { useEffect, useState } from 'react'
import { ClientSearchProvider } from '../context/SearchContext'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ClientSearchProvider>
      {isMounted ? children : <div>Loading...</div>}
    </ClientSearchProvider>
  )
} 