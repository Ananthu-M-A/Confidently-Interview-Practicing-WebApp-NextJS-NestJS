'use client'

import { useAuth } from '@/contexts/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const WithAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!user) {
        toast.error('You must be logged in to access this page.')
        router.push('/login')
      }
    }, [user, router])

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />
  }

  return ComponentWithAuth
}

export default WithAuth
