import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { CreateCampaignsRequestSchema, UpdateCampaignsRequestSchema } from "./schemas/CampaignsRequestSchema";

interface updateCampaignDTO {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export class CampaignsController {
  public index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany();
      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  public show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        // A relação n:n feita manualmente não trás o objeto lead, apenas a relação
        // Torna-se necessário usar 2 joins
        include: {
          leads: {
            include: {
              lead: true,
            },
          },
        },
      });

      if (!campaign) throw new HttpError(404, "Campanha não encontrada");

      res.status(200).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  public create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignsRequestSchema.parse(req.body);

      const { startDate, endDate } = body;
      let dates;

      if (endDate) {
        dates = {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        };
      } else {
        dates = {
          startDate: new Date(startDate),
          endDate: undefined,
        };
      }

      const createdCampaign = await prisma.campaign.create({
        data: {
          name: body.name,
          description: body.description,
          startDate: dates.startDate,
          endDate: dates.endDate,
        },
      });

      res.status(200).json(createdCampaign);
    } catch (error) {
      next(error);
    }
  };

  public update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campaignExists = await prisma.campaign.findUnique({ where: { id: id } });
      if (!campaignExists) throw new HttpError(404, "Campanha não encontrada");

      const body = UpdateCampaignsRequestSchema.parse(req.body);

      let campaignObj: updateCampaignDTO = {};

      if (body.name) {
        campaignObj.name = body.name;
      }
      if (body.description) {
        campaignObj.description = body.description;
      }
      if (body.startDate) {
        campaignObj.startDate = new Date(body.startDate);
      }

      if (body.endDate) {
        campaignObj.endDate = new Date(body.endDate);
      }

      const updatedCampaign = await prisma.campaign.update({
        data: campaignObj,
        where: { id },
      });

      res.status(200).json(updatedCampaign);
    } catch (error) {
      console.log("Erro no catch");

      next(error);
    }
  };

  public delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campaignExists = await prisma.campaign.findUnique({ where: { id } });

      if (!campaignExists) throw new HttpError(404, "Campanha não encontrada");

      const deletedCampaign = await prisma.campaign.delete({ where: { id } });
      res.status(200).json({ message: "Campanha excluída " });
    } catch (error) {
      next(error);
    }
  };
}
