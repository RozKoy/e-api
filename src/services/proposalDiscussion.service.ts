import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class ProposalDiscussionService {
    static async create(data: Prisma.ProposalDiscussionUncheckedCreateInput) {
        return await prisma.proposalDiscussion.create({ data });
    }

    static async getByProposalId(
        proposalId: string,
        search?: string,
        page?: number,
        limit?: number
    ) {
        if (!page) {
            const discussions = await prisma.proposalDiscussion.findMany({
                where: search
                    ? {
                        proposalId,
                        OR: [
                            { user: { email: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                        ],
                    }
                    : { proposalId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return {
                data: discussions,
                totalData: discussions.length,
                totalPages: 1,
            };
        }

        // Jika pakai pagination
        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [discussions, totalData] = await Promise.all([
            prisma.proposalDiscussion.findMany({
                skip,
                take,
                where: search
                    ? {
                        proposalId,
                        OR: [
                            { user: { email: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                        ],
                    }
                    : { proposalId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.proposalDiscussion.count({
                where: search
                    ? {
                        proposalId,
                        OR: [
                            { user: { email: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                        ],
                    }
                    : { proposalId },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: discussions,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.proposalDiscussion.findUnique({ where: { id } });
    }

    static async update(id: string, data: Prisma.ProposalDiscussionUncheckedUpdateInput) {
        return await prisma.proposalDiscussion.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.proposalDiscussion.delete({ where: { id } });
    }

}