'use client'

import { useExpertAuth } from '@/contexts/auth/ExpertAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const WithExpertAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { expert } = useExpertAuth()
    const router = useRouter()

    useEffect(() => {
      if (!expert) {
        router.push('/expert/login')
      }
    }, [expert, router])

    if (!expert) {
      return null;
    }

    return <WrappedComponent {...props} />
  }

  return ComponentWithAuth
}

export default WithExpertAuth
