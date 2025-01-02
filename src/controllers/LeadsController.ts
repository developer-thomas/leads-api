import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { CreateLeadAttributes, ILeadWhereParams, LeadsRepository } from "../repositories/LeadsRepository";

export class LeadsController {
  private leadsRepository: LeadsRepository;

  constructor(leadsRepository: LeadsRepository) {
    this.leadsRepository = leadsRepository;
  }

  public index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const { page = 1, pageSize = 10, name, status, sortBy = "name", order = "asc" } = query;

      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      const where: ILeadWhereParams = {};
      /* 
      Exemplo dos valores de where
      {
        name: {
          contains: "alice",
          mode: "insensitive"
        }
      }
      */
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await this.leadsRepository.find({
        where,
        limit,
        offset,
        sortBy,
        order,
      });
      const total = await this.leadsRepository.count(where);
      // const total = await prisma.lead.count({ where });
      // const leads = await prisma.lead.findMany({
      //   where,
      //   skip: (pageNumber - 1) * pageSizeNumber,
      //   take: pageSizeNumber,
      //   orderBy: { [sortBy]: order },
      // });

      res.json({
        data: leads,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Pega um lead através do id
  public show: Handler = async (req, res, next) => {
    try {
      // const lead = await prisma.lead.findUnique({
      //   where: { id: Number(req.params.id) },
      //   include: {
      //     groups: true,
      //     campaigns: true,
      //   },
      // });
      const lead = await this.leadsRepository.findById(+req.params.id);
      if (!lead) throw new HttpError(404, "Lead não encontrado!");

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  // Cria um lead
  public create: Handler = async (req, res, next) => {
    try {
      const body: CreateLeadAttributes = CreateLeadRequestSchema.parse(req.body);

      // const newLead = await prisma.lead.create({
      //   data: body,
      // });

      const newLead = await this.leadsRepository.create(body);
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  // Atualiza um lead
  public update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) throw new HttpError(404, "Lead inválido");

      const body = UpdateLeadRequestSchema.parse(req.body);
      if (!req.body) throw new HttpError(401, "Não pode estar vazio");

      // const lead = await prisma.lead.findUnique({ where: { id } });
      const lead = await this.leadsRepository.findById(id);
      if (!lead) throw new HttpError(404, "Lead não encontrado!");

      if (lead.status === "New" && lead.status !== undefined && body.status !== "Contacted") {
        throw new HttpError(400, "Lead com status 'New' deve possuir status 'Contacted' antes de ser atualizado para outro status");
      }

      if (body.status && body.status === "Archived") {
        const now = new Date();
        const diffTimeInMilliseconds = Math.abs(now.getTime() - lead.updatedAt.getTime());
        const diffDays = Math.ceil(diffTimeInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffDays < 180) throw new HttpError(400, "Um lead só pode ser arquivado após 6 meses de inatividade");
      }
      // const updatedUser = await prisma.lead.update({
      //   data: body,
      //   where: {
      //     id: id,
      //   },
      // });

      const updatedUser = await this.leadsRepository.updateById(id, body);
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

      // const leadExists = await prisma.lead.findUnique({ where: { id } });
      const leadExists = await this.leadsRepository.findById(id);
      if (!leadExists) throw new HttpError(404, "Lead não encontrado");

      // const deletedUser = await prisma.lead.delete({
      //   where: {
      //     id: id,
      //   },
      // });
      const deletedUser = await this.leadsRepository.deleteById(id);
      res.status(200).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
