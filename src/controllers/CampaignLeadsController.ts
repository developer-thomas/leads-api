import { Handler } from "express";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { Prisma } from "@prisma/client";
import { AddLeadRequestSchema, GetCampaignsRequestSchema, updateLeadStatusSchema } from "./schemas/CampaignsRequestSchema";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";

export class CampaignLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      if (!campaignId) throw new HttpError(404, "CampaignId não encontrado");

      const query = GetCampaignsRequestSchema.parse(req.query);
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query;
      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      // Sempre retornará as campanhas as quais tiverem ao menos um campaignId associado
      const where: Prisma.LeadWhereInput = {
        campaigns: {
          some: {
            campaignId,
          },
        },
      };

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.campaigns = { some: { status: status } };

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              leadId: true,
              status: true,
            },
          },
        },
      });

      const total = await prisma.lead.count();

      res.json({
        leads,
        meta: { page: pageNumber, pageSize: pageSize, total, totalPages: Math.ceil(total / pageSizeNumber) },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);

      const body = AddLeadRequestSchema.parse(req.body);

      const lead = await prisma.leadCampaign.create({
        data: {
          campaignId,
          leadId: Number(body.leadId),
          status: body.status,
        },
      });

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const body = updateLeadStatusSchema.parse(req.body);
      const campaignId = Number(req.params.campaignId);
      const leadId = Number(req.params.leadId);

      const leadCampaignExists = await prisma.leadCampaign.findUnique({
        where: {
          leadId_campaignId: {
            campaignId,
            leadId,
          },
        },
      });

      if (!leadCampaignExists) throw new HttpError(404, "Lead ou campanha não encontrado");

      const updatedLeadCampaign = await prisma.leadCampaign.update({
        data: body,
        where: {
          leadId_campaignId: {
            campaignId: campaignId,
            leadId: leadId,
          },
        },
      });

      res.status(200).json(updatedLeadCampaign);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId);
      const campaignId = Number(req.params.campaignId);

      const leadInCampaignExists = await prisma.leadCampaign.findUnique({
        where: {
          leadId_campaignId: {
            leadId,
            campaignId,
          },
        },
      });

      if (!leadInCampaignExists) throw new HttpError(404, "Não encontrado");

      const removedLeadCampaign = await prisma.leadCampaign.delete({
        where: {
          leadId_campaignId: {
            campaignId,
            leadId,
          },
        },
      });

      res.status(200).json({
        message: "Lead deletado com sucesso",
        data: {
          removedLeadCampaign,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
