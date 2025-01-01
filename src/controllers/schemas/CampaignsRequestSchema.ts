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

const LeadCampaignStatusEnum = z.enum(["New", "Engaged", "FollowUp_Scheduled", "Contacted", "Qualified", "Converted", "Unresposive", "Disqualified", "Re_Engeged", "Opted_Out"]);

export const GetCampaignsRequestSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: LeadCampaignStatusEnum.optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const AddLeadRequestSchema = z.object({
  leadId: z.number(),
  status: LeadCampaignStatusEnum.optional(),
});

export const updateLeadStatusSchema = z.object({
  status: LeadCampaignStatusEnum,
});
