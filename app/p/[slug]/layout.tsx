import { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: poll } = await supabase
    .from("polls")
    .select("question")
    .eq("slug", slug)
    .single();

  const title = poll?.question
    ? `${poll.question} - Open Poll`
    : "Open Poll - Free, Real-Time Minimalist Polling";
  const description =
    "Cast your vote and see live results instantly. No sign-ups required. Open-source polling at its best.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Open Poll",
      type: "website",
      images: [
        {
          url: `/p/${slug}/opengraph-image?v=3`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/p/${slug}/opengraph-image?v=3`],
    },
  };
}

export default function PollLayout({ children }: Props) {
  return <>{children}</>;
}
