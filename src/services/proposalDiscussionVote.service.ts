import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class ProposalDiscussionVoteService {
    static async create(data: Prisma.ProposalDiscussionVoteUncheckedCreateInput) {
        return await prisma.proposalDiscussionVote.create({ data });
    }

    static async getOneByUserIdAndProposalDiscussionId(userId: string, proposalDiscussionId: string) {
        return await prisma.proposalDiscussionVote.findFirst({ where: { userId, proposalDiscussionId } });
    }

    static async update(id: string, data: Prisma.ProposalDiscussionVoteUncheckedUpdateInput) {
        return await prisma.proposalDiscussionVote.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.proposalDiscussionVote.delete({ where: { id } });
    }

    static async count(proposalDiscussionId: string) {

        const total = await prisma.proposalDiscussionVote.count({ where: { proposalDiscussionId } });
        
        const agree = await prisma.proposalDiscussionVote.count({ where: { proposalDiscussionId, agree: true } });

        return { total, agree, disagree: total - agree };
    }
}