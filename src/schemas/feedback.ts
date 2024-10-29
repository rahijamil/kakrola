import { z } from "zod";

export const feedbackSchema = z.object({
  feedback: z.string().min(10, "Please provide more details").max(1000),
  metadata: z
    .object({
      browser: z.string().optional(),
      os: z.string().optional(),
      url: z.string().optional(),
      workspace_id: z.string().optional(),
      team_id: z.number().nullable().optional(),
      screenshots: z.array(z.string()).optional(),
    })
    .optional(),
});
