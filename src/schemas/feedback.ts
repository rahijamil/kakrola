import { z } from "zod";

export const feedbackSchema = z.object({
  type: z.enum(["BUG", "FEATURE", "FEEDBACK"]),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Please provide more details").max(1000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
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
