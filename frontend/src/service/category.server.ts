import "server-only";

import { createSsrClientFromNextCookies } from "@/supabase/server";
import type { Database } from "@/supabase/database.types";

export type Category = Database["public"]["Tables"]["category"]["Row"];

export const getRandomCategories = async (limit = 6): Promise<Category[]> => {
  const supabase = await createSsrClientFromNextCookies();
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("category_id");

  if (error) {
    throw new Error("Failed to load categories", { cause: error });
  }

  const categories = [...data];

  for (let index = categories.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [categories[index], categories[randomIndex]] = [
      categories[randomIndex],
      categories[index],
    ];
  }

  return categories.slice(0, limit);
};
