import prisma from "@/libs/prisma";
import { ProposalStatusEnum } from "@generated/prisma/client";

export class DashboardService {

    static async getDashboardData(year?: number, areaId?: string) {

        const currentYear = year || new Date().getFullYear();

        console.log(currentYear);

        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

        const [
            totalProposal,
            newProposal,
            proposalOnProgress,
            proposalFinished,
        ] = await Promise.all([
            prisma.proposal.count({
                where: {
                    ...(areaId ? { areaId } : undefined),
                    createdAt: { gte: yearStart, lte: yearEnd },
                }
            }),
            prisma.proposal.count({
                where: {
                    status: ProposalStatusEnum.baru,
                    ...(areaId ? { areaId } : undefined),
                    createdAt: { gte: yearStart, lte: yearEnd },
                }
            }),
            prisma.proposal.count({
                where: {
                    status: ProposalStatusEnum.diproses,
                    ...(areaId ? { areaId } : undefined),
                    createdAt: { gte: yearStart, lte: yearEnd },
                }
            }),
            prisma.proposal.count({
                where: {
                    status: ProposalStatusEnum.selesai,
                    ...(areaId ? { areaId } : undefined),
                    createdAt: { gte: yearStart, lte: yearEnd },
                }
            }),
        ]);

        const newProposalPerMonth: number[] = [];
        const proposalOnProgressPerMonth: number[] = [];
        const proposalFinishedPerMonth: number[] = [];

        for (let month = 0; month < 12; month++) {

            const startDate = new Date(currentYear, month, 1);
            const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59);

            const [newProposalCount, proposalOnProgressCount, proposalFinishedCount] = await Promise.all([
                prisma.proposal.count({
                    where: {
                        status: ProposalStatusEnum.baru,
                        ...(areaId ? { areaId } : undefined),
                        createdAt: { gte: startDate, lte: endDate },
                    }
                }),
                prisma.proposal.count({
                    where: {
                        status: ProposalStatusEnum.diproses,
                        ...(areaId ? { areaId } : undefined),
                        createdAt: { gte: startDate, lte: endDate },
                    }
                }),
                prisma.proposal.count({
                    where: {
                        status: ProposalStatusEnum.selesai,
                        ...(areaId ? { areaId } : undefined),
                        createdAt: { gte: startDate, lte: endDate },
                    }
                }),
            ]);

            newProposalPerMonth.push(newProposalCount);
            proposalOnProgressPerMonth.push(proposalOnProgressCount);
            proposalFinishedPerMonth.push(proposalFinishedCount);
        }

        return {
            count: {
                totalProposal,
                newProposal,
                proposalOnProgress,
                proposalFinished,
            },
            graph: {
                labels: [
                    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
                ],
                newProposalPerMonth,
                proposalOnProgressPerMonth,
                proposalFinishedPerMonth,
            }
        };
    }

}