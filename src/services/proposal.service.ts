import prisma from "@/libs/prisma";
import { Prisma, ProposalStatusEnum } from "@prisma/client";

export class ProposalService {

    static async create(data: Prisma.ProposalUncheckedCreateInput) {
        return await prisma.proposal.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number, areaId?: string, status?: string, categoryId?: string) {
        if (!page) {
            const proposals = await prisma.proposal.findMany({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(areaId ? { areaId } : undefined),
                    ...(status && { status: status as ProposalStatusEnum }),
                    ...(search ? {
                        OR: [
                            { title: { contains: search, mode: "insensitive" } },
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                            {customCategory: { contains : search, mode: "insensitive" }},
                        ]
                    } : undefined),
                },
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    area: true,
                    customCategory: true,
                    category: true,
                    user: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: proposals,
                totalData: proposals.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [proposals, totalData] = await Promise.all([
            prisma.proposal.findMany({
                skip,
                take,
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(areaId ? { areaId } : undefined),
                    ...(status && { status: status as ProposalStatusEnum }),
                    ...(search ? {
                        OR: [
                            { title: { contains: search, mode: "insensitive" } },
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                            {customCategory: { contains : search, mode: "insensitive" }},
                        ]
                    } : undefined),
                },
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    area: true,
                    category: true,
                    customCategory: true,
                    user: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.proposal.count({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(areaId ? { areaId } : undefined),
                    ...(status && { status: status as ProposalStatusEnum }),
                    ...(search ? {
                        OR: [
                            { title: { contains: search, mode: "insensitive" } },
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
                            {customCategory: { contains : search, mode: "insensitive" }},
                        ]
                    } : undefined),
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: proposals,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.proposal.findUnique({ where: { id }, include: { area: true, category: true, user: true } });
    }

    static async update(id: string, data: Prisma.ProposalUncheckedUpdateInput) {
        return await prisma.proposal.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.proposal.delete({ where: { id } });
    }
}