import { supabase } from '@/config/supabase'
import { useEffect, useState } from 'react'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
      }

      const u = data.session?.user

      const candidate =
        u?.user_metadata.full_name ||
        u?.user_metadata.name ||
        u?.app_metadata?.full_name ||
        u?.email?.split('@')[0]

      setName(candidate ?? '?')
    }

    fetchProfileName()
  }, [])

  return name || '?'
}
