import { z } from "zod";

export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Unresposive", "Desqualified", "Archived"]).optional(),
});

export const UpdateLeadRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Unresposive", "Desqualified", "Archived"]).optional(),
});
