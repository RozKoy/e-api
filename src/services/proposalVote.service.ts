import prisma from "@/libs/prisma";
import { Prisma } from "@generated/prisma/client";

export class ProposalVoteService {
    static async create(data: Prisma.ProposalVoteUncheckedCreateInput) {
        return await prisma.proposalVote.create({ data });
    }

    static async getOneByUserIdAndProposalId(userId: string, proposalId: string) {
        return await prisma.proposalVote.findFirst({ where: { userId, proposalId } });
    }

    static async update(id: string, data: Prisma.ProposalVoteUncheckedUpdateInput) {
        return await prisma.proposalVote.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.proposalVote.delete({ where: { id } });
    }

    static async count(proposalId: string) {

        const total = await prisma.proposalVote.count({ where: { proposalId } });
        
        const agree = await prisma.proposalVote.count({ where: { proposalId, agree: true } });

        return { total, agree, disagree: total - agree };
    }
}