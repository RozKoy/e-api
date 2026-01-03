import prisma from "@/libs/prisma";
import { Prisma, ProposalStatusEnum } from "@generated/prisma/client";

export class ProposalService {
    static async create(data: Prisma.ProposalUncheckedCreateInput) {
        return await prisma.proposal.create({ data });
    }

    static async getAll(
        search?: string,
        page?: number,
        limit?: number,
        areaId?: string,
        status?: string,
        categoryId?: string
    ) {
        if (!page) {
            const proposals = await prisma.proposal.findMany({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(areaId ? { areaId } : undefined),
                    ...(status && { status: status as ProposalStatusEnum }),
                    ...(search
                        ? {
                              OR: [
                                  {
                                      title: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                                  {
                                      area: {
                                          name: {
                                              contains: search,
                                              mode: "insensitive",
                                          },
                                      },
                                  },
                                  {
                                      user: {
                                          profile: {
                                              name: {
                                                  contains: search,
                                                  mode: "insensitive",
                                              },
                                          },
                                      },
                                  },
                                  {
                                      customCategory: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                              ],
                          }
                        : undefined),
                },
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    area: true,
                    customCategory: true,
                    category: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            roleId: true,
                            role: true,
                            positionId: true,
                            profile: true,
                            position: true,
                            accesses: {
                                include: { area: true, fraction: true },
                            },
                        },
                    },
                    assignments: {
                        include: {
                            role: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
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
                    ...(search
                        ? {
                              OR: [
                                  {
                                      title: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                                  {
                                      area: {
                                          name: {
                                              contains: search,
                                              mode: "insensitive",
                                          },
                                      },
                                  },
                                  {
                                      user: {
                                          profile: {
                                              name: {
                                                  contains: search,
                                                  mode: "insensitive",
                                              },
                                          },
                                      },
                                  },
                                  {
                                      customCategory: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                              ],
                          }
                        : undefined),
                },
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    area: true,
                    category: true,
                    customCategory: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            roleId: true,
                            role: true,
                            positionId: true,
                            profile: true,
                            position: true,
                            accesses: {
                                include: { area: true, fraction: true },
                            },
                        },
                    },
                    assignments: {
                        include: {
                            role: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.proposal.count({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(areaId ? { areaId } : undefined),
                    ...(status && { status: status as ProposalStatusEnum }),
                    ...(search
                        ? {
                              OR: [
                                  {
                                      title: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                                  {
                                      area: {
                                          name: {
                                              contains: search,
                                              mode: "insensitive",
                                          },
                                      },
                                  },
                                  {
                                      user: {
                                          profile: {
                                              name: {
                                                  contains: search,
                                                  mode: "insensitive",
                                              },
                                          },
                                      },
                                  },
                                  {
                                      customCategory: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                              ],
                          }
                        : undefined),
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
        return await prisma.proposal.findUnique({
            where: { id },
            include: {
                area: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        roleId: true,
                        role: true,
                        positionId: true,
                        profile: true,
                        position: true,
                        accesses: {
                            include: { area: true, fraction: true },
                        },
                    },
                },
            },
        });
    }

    static async update(id: string, data: Prisma.ProposalUncheckedUpdateInput) {
        return await prisma.proposal.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.proposal.delete({ where: { id } });
    }

    static async getExportData(
        startDate?: Date,
        endDate?: Date,
        areaId?: string
    ) {
        const where: any = {};

        if (startDate && !endDate) {
            where.createdAt = {
                gte: startDate,
                lte: new Date(),
            };
        } else if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (areaId) {
            where.areaId = areaId;
        }

        const proposals = await prisma.proposal.findMany({
            where,
            select: {
                id: true,
                status: true,
                title: true,
                description: true,
                fileUrl: true,
                area: true,
                category: true,
                votes: true,
                customCategory: true,
                user: {
                    include: { profile: true },
                },
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "asc" },
        });

        return proposals.map((p) => ({
            ...p,
            like: p.votes.filter((v) => v.agree === true).length,
            dislike: p.votes.filter((v) => v.agree === false).length,
        }));
    }

    static async getProposalYears() {
        const years = await prisma.proposal.findMany({
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return [...new Set(years.map((y) => y.createdAt.getFullYear()))];
    }
}
