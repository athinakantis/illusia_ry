
import { supabase } from "../config/supabase"
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
      }
      // Prefer user‑supplied avatar, then provider avatar (e.g. Google)
      setImage(
        data.session?.user.user_metadata.avatar_url ??
          data.session?.user.app_metadata?.avatar_url ??
          null
      )
    }
    fetchUserImage()
  }, [])

  return image
}
