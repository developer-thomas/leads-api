import { Router } from "express";
import { CampaignLeadsController } from "../controllers/CampaignLeadsController";

export const campaingLeadsRoutes = Router();
const campaingLeadsController = new CampaignLeadsController();

campaingLeadsRoutes.get("/campaign/:campaignId/leads", campaingLeadsController.getLeads);
campaingLeadsRoutes.post("/campaign/:campaignId/leads", campaingLeadsController.addLead);
campaingLeadsRoutes.put("/campaign/:campaignId/leads/:leadId", campaingLeadsController.updateLeadStatus);
campaingLeadsRoutes.delete("/campaign/:campaignId/leads/:leadId", campaingLeadsController.removeLead);
