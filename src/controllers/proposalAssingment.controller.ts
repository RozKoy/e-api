import { NotificationService } from '@/services/notification.service';
import { ProposalService } from '@/services/proposal.service';
import { ProposalAssignmentService } from '@/services/proposalAssignment.service';
import { ProposalStatusService } from '@/services/proposalStatus.service';
import { RolePermissionService } from '@/services/rolePermission.service';
import { UserAccessService } from '@/services/userAccess.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';
import Validator from 'fastest-validator';

export class ProposalAssingmentController {

    static async assign(req: AuthenticatedRequest, res: Response) {

        const { proposalId, roleId } = req.body;

        const { userId, roleId: userRoleId } = req.payload!;

        const v = new Validator();

        const schema = {
            proposalId: { type: "string", empty: false },
            roleId: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ proposalId, roleId });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const proposalExist = await ProposalService.getOneById(proposalId);

            if (!proposalExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Proposal tidak ditemukan'
                });
            }

            const userRolePermission = await RolePermissionService.getAllByRoleId(userRoleId as string);

            if (proposalExist.status == "baru") {

                const hasPermission = userRolePermission.some((rolePermission) => rolePermission.permission.name === 'Disposisi Proposal');

                if (!hasPermission) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Anda tidak memiliki izin untuk mendisposisi proposal ini'
                    });
                }

            }

            if (proposalExist.status !== "baru") {

                const lastAssignedRole = await ProposalAssignmentService.getLastAssignedRole(proposalId);

                
                if (lastAssignedRole && lastAssignedRole.roleId !== userRoleId) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Anda tidak memiliki izin untuk mendisposisi proposal ini'
                    });
                }

                const hasAccess = await UserAccessService.getByUserId(userId);

                if (!hasAccess.some((access) => access.areaId == proposalExist.areaId)) {
                    console.log("PONG")
                    console.log(hasAccess, proposalExist.areaId);
                    return res.status(403).json({
                        status: 'error',
                        message: 'Anda tidak memiliki izin untuk mendisposisi proposal ini'
                    });
                }

            }

            const proposalAssignment = await ProposalAssignmentService.create({ proposalId, roleId });

            await ProposalService.update(proposalId, { status: "diproses" });

            await ProposalStatusService.create({ proposalId, userId, status: "diproses" });

            await NotificationService.create({ userId: proposalExist.userId, proposalId, status: "diproses" });

            return res.status(201).json({
                status: 'success',
                message: 'Proposal assignment berhasil ditambahkan',
                data: proposalAssignment
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal menambahkan proposal assignment' });
        }
    }

    static async finishAssignment(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;

        const { userId, roleId } = req.payload!;

        if (!proposalId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
            });
        }

        try {

            const proposalExist = await ProposalService.getOneById(proposalId);

            if (!proposalExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Proposal tidak ditemukan'
                });
            }

            const lastAssignedRole = await ProposalAssignmentService.getLastAssignedRole(proposalId);

            if (lastAssignedRole && lastAssignedRole.roleId !== roleId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki izin untuk mendisposisi proposal ini'
                });
            }

            const hasAccess = await UserAccessService.getByUserId(userId);

            if (!hasAccess.some((access) => access.areaId === proposalExist.areaId)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki izin untuk mendisposisi proposal ini'
                });
            }

            await ProposalService.update(proposalId, { status: "selesai" });

            await ProposalStatusService.create({ proposalId, userId, status: "selesai" });

            await NotificationService.create({ userId: proposalExist.userId, proposalId, status: "selesai" });

            return res.status(200).json({
                status: 'success',
                message: 'Disposisi proposal berhasil diselesaikan'
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal menyelesaikan disposisi proposal' });
        }
    }

    static async getByProposalId(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;

        const { roleId } = req.query;

        if (!proposalId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
            });
        }

        try {

            const data = await ProposalAssignmentService.getByProposalId(proposalId, roleId as string);

            res.status(200).json({
                status: 'success',
                message: 'Data proposal assignment berhasil didapatkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data proposal assignment' });
        }
    }

}