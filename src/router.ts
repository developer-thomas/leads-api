import { Router } from "express";

import { leadRoutes } from "./routes/leads-router";
import { groupsRoutes } from "./routes/groups-router";
import { campaignsRoutes } from "./routes/campaign-router";
import { campaingLeadsRoutes } from "./routes/campaingLeads-route";
import { leadsGroupRoutes } from "./routes/leadsGroup-route";

const router = Router();

// Rotas de Leads
router.use(leadRoutes);

// Rotas de Grupos
router.use(groupsRoutes);

// Rotas de Campanhas
router.use(campaignsRoutes);

// Rotas de Campaign Leads
router.use(campaingLeadsRoutes);

// Rotas de Leads Group
router.use(leadsGroupRoutes);

router.get("/status", async (req, res, next) => {
  try {
    res.json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

export { router };
