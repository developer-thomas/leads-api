import { Lead } from "@prisma/client";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Unresposive" | "Desqualified" | "Archived";

export interface ILeadWhereParams {
  name?: {
    contains?: string;
    equals?: string;
    mode: "default" | "insensitive";
  };
  status?: LeadStatus;
}

export interface IFindLeadsParams {
  where?: ILeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface CreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface LeadsRepository {
  find: (params: IFindLeadsParams) => Promise<Lead[]>;
  findById: (id: number) => Promise<Lead | null>;
  count: (where: ILeadWhereParams) => Promise<number>;
  create: (attributes: CreateLeadAttributes) => Promise<Lead>;
  updateById: (id: number, attributes: Partial<CreateLeadAttributes>) => Promise<Lead | null>;
  deleteById: (id: number) => Promise<Lead | null>;
}
