import { z } from "zod";

export const CreateCampaignsRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export const UpdateCampaignsRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
