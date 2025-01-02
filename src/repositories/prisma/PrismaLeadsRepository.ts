import { Lead } from "@prisma/client";
import { CreateLeadAttributes, IFindLeadsParams, ILeadWhereParams, LeadsRepository } from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements LeadsRepository {
  async find(params: IFindLeadsParams): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: {
        name: {
          contains: params.where?.name?.contains,
          mode: params.where?.name?.mode,
        },
        status: params.where?.status,
      },
      orderBy: { [params.sortBy ?? "name"]: params.order },
      skip: params.offset,
      take: params.limit,
    });
  }
  async findById(id: number): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        campaigns: true,
        groups: true,
      },
    });
  }
  async count(where: ILeadWhereParams): Promise<number> {
    return prisma.lead.count({
      where: {
        name: {
          contains: where.name?.contains,
          equals: where.name?.equals,
          mode: where.name?.mode,
        },
        status: where.status,
      },
    });
  }
  async create(attributes: CreateLeadAttributes): Promise<Lead> {
    const { name, email, phone, status } = attributes;
    return prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status,
      },
    });
  }
  async updateById(id: number, attributes: Partial<CreateLeadAttributes>): Promise<Lead | null> {
    const { name, email, phone, status } = attributes;
    return prisma.lead.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        status,
      },
    });
  }
  async deleteById(id: number): Promise<Lead | null> {
    return prisma.lead.delete({
      where: { id },
    });
  }
}
