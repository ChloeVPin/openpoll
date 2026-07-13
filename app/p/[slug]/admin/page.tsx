import { createServiceClient } from "@/lib/supabase/server";
import { AdminClient } from "./admin-client";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AdminPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;
  const { token } = resolvedSearchParams;

  const supabase = createServiceClient();

  // Fetch poll details - server component with service-role client can read all columns
  const { data: poll, error } = await supabase
    .from("polls")
    .select(
      "id, question, created_at, expires_at, is_public, allow_multiple, admin_token, admin_password",
    )
    .eq("slug", slug)
    .single();

  if (error || !poll) {
    notFound();
  }

  // Check if the provided token matches
  let initialAuth = false;
  if (token && poll.admin_token === token) {
    initialAuth = true;
  }

  // Only pass safe data to the client - never the actual admin_token or admin_password hash
  const safePoll = {
    id: poll.id,
    question: poll.question,
    created_at: poll.created_at,
    expires_at: poll.expires_at,
    is_public: poll.is_public,
    allow_multiple: poll.allow_multiple,
  };

  return (
    <AdminClient
      slug={slug}
      poll={safePoll}
      initialToken={initialAuth && token ? token : null}
      hasPassword={!!poll.admin_password}
    />
  );
}
