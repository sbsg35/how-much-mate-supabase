import { supabaseBrowserClient } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";

export type Suburb = Database["public"]["Tables"]["suburb"]["Row"];

const searchSuburbs = async (query: string, limit: number = 5): Promise<Suburb[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();
  const isNumeric = /^\d+$/.test(trimmedQuery);

  const searchColumn = isNumeric ? "postcode" : "locality";
  const { data, error } = await supabaseBrowserClient()
    .from("suburb")
    .select("*")
    .ilike(searchColumn, `${trimmedQuery}%`)
    .order("locality", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error searching suburbs:", error);
    throw new Error("Failed to search suburbs");
  }

  const suburbs = data ?? [];

  // Keep TypeORM behavior: prioritize exact prefix matches in the queried field,
  // then keep alphabetical locality ordering for the rest.
  const sortedSuburbs = suburbs.sort((a, b) => {
    const aStartsWith = isNumeric
      ? a.postcode.startsWith(trimmedQuery)
      : a.locality.toLowerCase().startsWith(trimmedQuery.toLowerCase());
    const bStartsWith = isNumeric
      ? b.postcode.startsWith(trimmedQuery)
      : b.locality.toLowerCase().startsWith(trimmedQuery.toLowerCase());

    if (aStartsWith !== bStartsWith) {
      return aStartsWith ? -1 : 1;
    }

    return a.locality.localeCompare(b.locality);
  });

  return sortedSuburbs.slice(0, limit);
};

const suburbQueryKeys = {
  all: ["suburbs"] as const,
  search: (query: string) => ["suburbs", "search", query] as const,
};

export const useSuburbSearch = (query: string) =>
  useQuery({
    queryKey: suburbQueryKeys.search(query),
    queryFn: () => searchSuburbs(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: query.trim().length >= 2, // Only search if query is at least 2 characters
  });

const getSuburbById = async (suburb_id: string): Promise<Suburb | null> => {
  if (!suburb_id) {
    return null;
  }

  const { data, error } = await supabaseBrowserClient()
    .from("suburb")
    .select("*")
    .eq("suburb_id", suburb_id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching suburb by id:", error);
    throw new Error("Failed to fetch suburb");
  }

  return data;
};

export const useSuburbById = (suburb_id: string) =>
  useQuery({
    queryKey: ["suburb", suburb_id],
    queryFn: () => getSuburbById(suburb_id),
    enabled: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
