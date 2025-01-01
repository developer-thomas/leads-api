import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";

export class GroupsLeadsController {
  // Obter todos os leads de um determinado grupo
  getLeadsFromGroup: Handler = async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      if (!groupId) throw new HttpError(201, "groupId inválido");

      const leads = await prisma.group.findUnique({
        where: {
          id: Number(groupId),
        },
        include: {
          leads: true,
        },
      });

      res.status(200).json(leads);
    } catch (error) {
      next(error);
    }
  };

  // Adicionar lead a um grupo
  addLeadToGroup: Handler = async (req, res, next) => {
    try {
      const { leadId } = req.body;
      if (!leadId) throw new HttpError(201, "Lead inválido");

      const groupId = Number(req.params.groupId);
      if (!groupId) throw new HttpError(201, "Grupo inválido");

      const groupExists = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });
      if (!groupExists) throw new HttpError(404, "Grupo não encontrado");

      const leadsExists = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      if (!leadsExists) throw new HttpError(404, "Lead não encontrado");

      const newLead = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          leads: {
            connect: {
              id: leadId,
            },
          },
        },
        include: {
          leads: leadId,
        },
      });
      res.status(200).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  deleteLeadFromGroup: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId);
      if (!leadId) throw new HttpError(201, "Lead inválido");

      const groupId = Number(req.params.groupId);
      if (!groupId) throw new HttpError(201, "Grupo inválido");

      const groupExists = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });
      if (!groupExists) throw new HttpError(404, "Grupo não encontrado");

      const leadsExists = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      if (!leadsExists) throw new HttpError(404, "Lead não encontrado");

      const deletedLead = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          leads: {
            disconnect: {
              id: leadId,
            },
          },
        },
        include: {
          leads: true,
        },
      });

      res.status(200).json({
        message: "Lead Deleted Sucessfully",
        newGroup: { deletedLead },
      });
    } catch (error) {
      next(error);
    }
  };
}
