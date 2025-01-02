import { LeadsController } from "../controllers/LeadsController";
import { PrismaLeadsRepository } from "../repositories/prisma/PrismaLeadsRepository";
import { Router } from "express";

export const leadRoutes = Router();
const prismaRepositorie = new PrismaLeadsRepository();
const leadsController = new LeadsController(prismaRepositorie);

// Rotas de Leads
leadRoutes.get("/leads", leadsController.index);
leadRoutes.post("/leads", leadsController.create);
leadRoutes.get("/leads/:id", leadsController.show);
leadRoutes.put("/leads/:id", leadsController.update);
leadRoutes.delete("/leads/:id", leadsController.delete);
