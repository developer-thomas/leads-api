import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class LeadsController {
  // Retorna todos os leads
  public index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany();
      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  // Pega um lead através do id
  public show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!lead) throw new HttpError(404, "Lead não encontrado!");

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  // Cria um lead
  public create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({
        data: body,
      });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  // Atualiza um lead
  public update: Handler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (!id) throw new HttpError(404, "Lead inválido");

      const body = UpdateLeadRequestSchema.parse(req.body);
      if (!req.body) throw new HttpError(401, "Não pode estar vazio");

      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado!");

      const updatedUser = await prisma.lead.update({
        data: body,
        where: {
          id: id,
        },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  // Deleta um lead
  public delete: Handler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (!id) throw new HttpError(404, "Lead inválido");

      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado");

      const deletedUser = await prisma.lead.delete({
        where: {
          id: +id,
        },
      });

      res.status(200).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
