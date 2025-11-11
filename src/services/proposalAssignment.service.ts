import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class ProposalAssignmentService {

    static async getLastAssignedRole(proposalId: string) {
        return await prisma.proposalAssignment.findFirst({ where: { proposalId }, orderBy: { createdAt: 'desc' }, include: { role: true } });
    }

    static async create(data: Prisma.ProposalAssignmentUncheckedCreateInput) {
        return await prisma.proposalAssignment.create({ data });
    }

    static async getByProposalId(proposalId: string, roleId?: string) {
        return await prisma.proposalAssignment.findMany({ where: { proposalId, ...(roleId ? { roleId } : undefined) }, include: { proposal: true, role: true }, orderBy: { createdAt: "desc" }, });
    }

    static async getAll(roleId?: string, proposalId?: string, page?: number, limit?: number) {
        
        if (!page) {
            
            const proposalAssignment = await prisma.proposalAssignment.findMany({
                where: {
                    ...(roleId ? { roleId } : undefined),
                    ...(proposalId ? { proposalId } : undefined),
                },
                include: {
                    role: true,
                    proposal: true
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return {
                data: proposalAssignment,
                totalData: proposalAssignment.length,
                totalPages: 1,
            };
            
        }

        // Jika pakai pagination
        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [proposalAssignment, totalData] = await Promise.all([
            
            prisma.proposalAssignment.findMany({
                skip,
                take,
                where: {
                    ...(roleId ? { roleId } : undefined),
                    ...(proposalId ? { proposalId } : undefined),
                },
                include: {
                    role: true,
                    proposal: true
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.proposalAssignment.count({
                where: {
                    ...(roleId ? { roleId } : undefined),
                    ...(proposalId ? { proposalId } : undefined),
                },
            }),

        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: proposalAssignment,
            totalData,
            totalPages,
        };
    }

}