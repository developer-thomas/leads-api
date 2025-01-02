import { Router } from "express";
import { GroupsLeadsController } from "../controllers/GroupsLeadsController";

export const leadsGroupRoutes = Router();
const groupsLeadsController = new GroupsLeadsController();

leadsGroupRoutes.get("/groups/:groupId/leads", groupsLeadsController.getLeadsFromGroup);
leadsGroupRoutes.post("/groups/:groupId/leads", groupsLeadsController.addLeadToGroup);
leadsGroupRoutes.delete("/groups/:groupId/leads/:leadId", groupsLeadsController.deleteLeadFromGroup);
