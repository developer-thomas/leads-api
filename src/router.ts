import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsController } from "./controllers/CampaignsController";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { GroupsLeadsController } from "./controllers/GroupsLeadsController";
const router = Router();

const leadsController = new LeadsController();
const groupsController = new GroupsController();
const campaignsController = new CampaignsController();
const campaingLeadsController = new CampaignLeadsController();
const groupsLeadsController = new GroupsLeadsController();

// Rotas de Leads
router.get("/leads", leadsController.index);
router.post("/leads", leadsController.create);
router.get("/leads/:id", leadsController.show);
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

// Rotas de Grupos
router.get("/groups", groupsController.index);
router.post("/groups", groupsController.create);
router.get("/groups/:id", groupsController.show);
router.put("/groups/:id", groupsController.update);
router.delete("/groups/:id", groupsController.delete);

// Rotas de Campanhas
router.get("/campaigns", campaignsController.index);
router.post("/campaigns", campaignsController.create);
router.get("/campaigns/:id", campaignsController.show);
router.put("/campaigns/:id", campaignsController.update);
router.delete("/campaigns/:id", campaignsController.delete);

// Rotas de Campaign Leads
router.get("/campaign/:campaignId/leads", campaingLeadsController.getLeads);
router.post("/campaign/:campaignId/leads", campaingLeadsController.addLead);
router.put("/campaign/:campaignId/leads/:leadId", campaingLeadsController.updateLeadStatus);
router.delete("/campaign/:campaignId/leads/:leadId", campaingLeadsController.removeLead);

// Rotas de Leads Group
router.get("/groups/:groupId/leads", groupsLeadsController.getLeadsFromGroup);
// Adicionar lead a um grupo
router.post("/groups/:groupId/leads", groupsLeadsController.addLeadToGroup);
// Delete um lead de um grupo
router.delete("/groups/:groupId/leads/:leadId", groupsLeadsController.deleteLeadFromGroup);

router.get("/status", async (req, res, next) => {
  try {
    res.json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

export { router };
