import { z } from "zod";

export const OptionSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(1, "Option text is required")
    .max(100, "Option is too long"),
});

export const CreatePollSchema = z.object({
  question: z
    .string()
    .min(3, "Question is too short")
    .max(255, "Question is too long"),
  options: z
    .array(OptionSchema)
    .min(2, "At least two options are required")
    .max(50, "Too many options"),
  is_public: z.boolean(),
  allow_multiple: z.boolean(),
  duration_hours: z.number().min(1).max(336),
  admin_password: z.string().max(100).optional(),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;
export type PollOption = z.infer<typeof OptionSchema>;

/** Public poll shape - safe to send to browser (no admin_token or admin_password) */
export type Poll = {
  id: string;
  slug: string;
  question: string;
  options: PollOption[];
  is_public: boolean;
  allow_multiple: boolean;
  expires_at: string | null;
  created_at: string;
};

/** Vote shape - fingerprint is only stored server-side, never exposed to clients */
export type Vote = {
  id: string;
  poll_id: string;
  option_id: string;
  fingerprint: string;
  created_at: string;
};
