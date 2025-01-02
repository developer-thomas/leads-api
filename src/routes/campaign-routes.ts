import { Router } from "express";
import { CampaignsController } from "../controllers/CampaignsController";

export const campaignsRoutes = Router();
const campaignsController = new CampaignsController();

campaignsRoutes.get("/campaigns", campaignsController.index);
campaignsRoutes.post("/campaigns", campaignsController.create);
campaignsRoutes.get("/campaigns/:id", campaignsController.show);
campaignsRoutes.put("/campaigns/:id", campaignsController.update);
campaignsRoutes.delete("/campaigns/:id", campaignsController.delete);
