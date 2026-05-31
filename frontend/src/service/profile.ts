import { useAuth } from "@/providers/AuthProvider";
import { supabaseBrowserClient } from "../supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

const getProfile = async (userId: string | undefined): Promise<Profile> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const {
    data,
    error,
  } = await supabaseBrowserClient().from("profile").select("*").eq(
    "profile_id",
    userId,
  )
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Profile not found");
  }

  return data;
};

export const useProfile = () => {
  const { user } = useAuth();
  console.log("Fetching profile for user:", user);
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => getProfile(user?.id),
    enabled: !!user?.id,
  });
};
