import { Router } from "express";
import { GroupsController } from "../controllers/GroupsController";

export const groupsRoutes = Router();

const groupsController = new GroupsController();

groupsRoutes.get("/groups", groupsController.index);
groupsRoutes.post("/groups", groupsController.create);
groupsRoutes.get("/group/:id", groupsController.show);
groupsRoutes.put("groups/:id", groupsController.update);
groupsRoutes.delete("groups/:id", groupsController.delete);
