import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

/** Public vote shape - no fingerprint exposed */
export type PublicVote = {
  id: string;
  poll_id: string;
  option_id: string;
  created_at: string;
};

export function useLiveVotes(pollId: string | undefined) {
  const queryClient = useQueryClient();

  // Initial fetch - only public columns (no fingerprint)
  const { data: votes = [], isLoading } = useQuery({
    queryKey: ["votes", pollId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votes")
        .select("id, poll_id, option_id, created_at")
        .eq("poll_id", pollId);

      if (error) throw new Error(error.message);
      return data as PublicVote[];
    },
    enabled: !!pollId,
  });

  // Subscribe to real-time changes
  useEffect(() => {
    if (!pollId) return;

    const channel = supabase
      .channel(`public:votes:poll_id=eq.${pollId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${pollId}`,
        },
        (payload) => {
          queryClient.setQueryData<PublicVote[]>(
            ["votes", pollId],
            (oldData) => {
              const newVote = payload.new as PublicVote;
              if (!oldData) return [newVote];
              // Prevent duplicates
              if (oldData.some((v) => v.id === newVote.id)) {
                return oldData;
              }
              return [...oldData, newVote];
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId, queryClient]);

  return { votes, isLoading };
}
