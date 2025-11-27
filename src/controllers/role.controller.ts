import { PermissionService } from '@/services/permission.service';
import { RoleService } from '@/services/role.service';
import { RolePermissionService } from '@/services/rolePermission.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class RoleController {
    static async create(req: Request, res: Response) {

        const { name, description, permissionIds } = req.body;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false },
                description: { type: "string", optional: true },
                permissionIds: {
                    type: "array",
                    items: {
                        type: "object",
                        props: {
                            id: { type: "string", empty: false }
                        }
                    },
                    empty: false
                }
            }

            const check = v.compile(schema);

            const validationResponse = check({ name, description, permissionIds });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const roleExist = await RoleService.getOneByName(name);

            if (roleExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role sudah terdaftar'
                });
            }

            const data = await RoleService.create({ name, description });

            let permissions = [];

            for (const permissionId of permissionIds) {

                const permission = await PermissionService.getOneById(permissionId.id);

                if (!permission) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Permission ${permissionId.id} tidak ditemukan`
                    });
                }

                permissions.push({
                    permissionId: permission.id,
                    roleId: data.id
                });
            }

            if (permissions.length > 0) {
                await RoleService.assignMany(permissions);
            }

            res.status(201).json({
                status: 'success',
                message: 'Data role berhasil ditambahkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal menambahkan data role'
            });

        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await RoleService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data role berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data role'
            });

        }
    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const data = await RoleService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data role berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data role'
            });

        }
    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;
        const { name, description, permissionIds } = req.body;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false },
                description: { type: "string", optional: true, empty: false },
                permissionIds: {
                    type: "array",
                    items: {
                        type: "object",
                        props: {
                            id: { type: "string", empty: false }
                        }
                    },
                    optional: true,
                    empty: false
                }
            }

            const check = v.compile(schema);

            const validationResponse = check({ name, description, permissionIds });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const roleExist = await RoleService.getOneById(id);

            if (!roleExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role tidak ditemukan'
                });
            }

            const roleNameExist = await RoleService.getOneByName(name, id);

            if (roleNameExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role sudah terdaftar'
                });
            }

            const data = await RoleService.update(id, { name, description });

            let permissions = [];

            for (const permissionId of permissionIds) {

                const permission = await PermissionService.getOneById(permissionId.id);

                if (!permission) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Permission ${permissionId.id} tidak ditemukan`
                    });
                }

                permissions.push({
                    permissionId: permission.id,
                    roleId: data.id
                });
            }

            if (permissions.length > 0) {
                await RolePermissionService.deleteByRoleId(data.id);
                await RoleService.assignMany(permissions);
            }

            res.status(200).json({
                status: 'success',
                message: 'Data role berhasil diubah',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengubah data role'
            });

        }
    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const roleExist = await RoleService.getOneById(id);

            if (!roleExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role tidak ditemukan'
                });
            }

            const data = await RoleService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data role berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus data role'
            });

        }
    }
}