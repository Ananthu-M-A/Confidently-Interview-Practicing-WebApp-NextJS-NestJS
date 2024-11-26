'use client'

import { useAdminAuth } from '@/contexts/auth/AdminAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const WithAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { admin } = useAdminAuth()
    const router = useRouter()

    useEffect(() => {
      if (!admin) {
        router.push('/admin/login')
      }
    }, [admin, router])

    if (!admin) {
      return null;
    }

    return <WrappedComponent {...props} />
  }

  return ComponentWithAuth
}

export default WithAdminAuth
