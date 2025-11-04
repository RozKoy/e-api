import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class ProposalAssignmentService {

    static async getLastAssignedRole(proposalId: string) {
        return await prisma.proposalAssignment.findFirst({ where: { proposalId }, orderBy: { createdAt: 'desc' }, include: { role: true } }); 
    }

    static async create(data: Prisma.ProposalAssignmentUncheckedCreateInput) {
        return await prisma.proposalAssignment.create({ data }); 
    }

}