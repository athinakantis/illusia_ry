import { supabase } from "../config/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const uid = session?.user.id;
      if (!uid) {
        console.log("No session or user id, setting image to null.");
        setImage(null);
        return;
      }

      // 2) read your users table’s profile_image_url
      const { data: users, error } = await supabase
        .from("users")
        .select("profile_image_url")
        .eq("user_id", uid)
        .single();

      if (error) {
        console.error(error);
        setImage(null);
        return;
      }
      console.log("Fetched users.profile_image_url:", users?.profile_image_url);
      // 3) fallback to metadata avatars if no custom image
      const chosen =
        users.profile_image_url
        ?? session.user.user_metadata.avatar_url
        ?? session.user.app_metadata?.avatar_url
        ?? null;
      setImage(chosen);
    };
    fetch();
   
    
  }, [session]);

  return image;
};