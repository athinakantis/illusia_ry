import { useEffect, useState } from 'react'
import { useAuth } from "./useAuth"
import { usersApi } from "../api/users"


export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)
  const { session } = useAuth()
  useEffect(() => {
    const fetchProfileName = async () => {
      if (!session) return null
     const { data: userData} = await usersApi.getUserById(session?.user.id)
     const display_name = userData?.display_name
      const u = session?.user

      const candidate =
        display_name ||
        u?.user_metadata.full_name ||
        u?.user_metadata.name ||
        u?.app_metadata?.full_name ||
        u?.email?.split('@')[0]

      setName(candidate ?? '?')
    }

    fetchProfileName()
  }, [session])

  return name || '?'
}
