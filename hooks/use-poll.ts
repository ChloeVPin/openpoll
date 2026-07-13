import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Poll } from "@/lib/types";

export function usePoll(slug: string) {
  return useQuery({
    queryKey: ["poll", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("polls")
        .select(
          "id, slug, question, options, is_public, allow_multiple, expires_at, created_at",
        )
        .eq("slug", slug)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as Poll;
    },
    enabled: !!slug,
  });
}
