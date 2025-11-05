import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class ProposalStatusService {
    static async create(data: Prisma.ProposalStatusUncheckedCreateInput) {
        return await prisma.proposalStatus.create({ data });
    }

    static async deleteByProposalId(proposalId: string) {
        return await prisma.proposalStatus.deleteMany({ where: { proposalId } });
    }

    static async getByProposalId(proposalId: string) {
        return await prisma.proposalStatus.findMany({ where: { proposalId } });
    }
}