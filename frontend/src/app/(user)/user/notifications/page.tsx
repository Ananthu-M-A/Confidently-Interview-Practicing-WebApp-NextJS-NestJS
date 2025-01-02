import WithAuth from '@/components/auth-guards/WithAuth'
import React from 'react'

const Notifications = () => {
  return (
    <div>
      Notifications
    </div>
  )
}

export default WithAuth(Notifications) 
