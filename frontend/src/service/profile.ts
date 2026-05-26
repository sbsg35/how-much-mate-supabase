import { supabaseBrowserClient } from "../supabase/client";
import { useQuery } from "@tanstack/react-query";

const getUser = async () => {
  const {
    data: { user },
  } = await supabaseBrowserClient().auth.getUser();
  console.log("Fetched user:", user);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getUser,
  });
};
