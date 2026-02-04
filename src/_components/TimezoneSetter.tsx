'use client'
import { useEffect } from 'react'

export function TimezoneSetter() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Set a cookie that expires in 365 days
    document.cookie = `user-timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  return null
}