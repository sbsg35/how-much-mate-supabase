import { supabaseBrowserClient } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";

export type Category = Database["public"]["Tables"]["category"]["Row"];

const categoryList = async (): Promise<Category[]> => {
  const { data, error } = await supabaseBrowserClient().rpc(
    "get_public_categories",
  );

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
  return data ?? [];
};

const categoryQueryKeys = {
  all: ["categories"] as const,
};

export const useCategories = () =>
  useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: categoryList,
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
