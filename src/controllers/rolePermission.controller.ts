import { PermissionService } from '@/services/permission.service';
import { RolePermissionService } from '@/services/rolePermission.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class RolePermissionController {

    static async getAll(req: Request, res: Response) {

        try {

            const data = await RolePermissionService.getAll();

            res.status(200).json({
                status: 'success',
                message: 'Data role permission berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data role permission' });

        }
    }

    static async assignMany(req: Request, res: Response) {

        const { roleId } = req.params;

        if (!roleId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id role wajib diisi'
            });
        }

        const { permissionIds } = req.body;

        const v = new Validator();

        const schema = {
            permissionIds: {
                type: "array",
                items: {
                    type: "object",
                    props: {
                        id: { type: "string", empty: false }
                    }
                },
                empty: false,
            }
        };

        const check = v.compile(schema);

        const validationResponse = check({ permissionIds });

        if (validationResponse !== true) {
            return res.status(400).json({
                status: 'error',
                message: validationResponse
            });
        }
        
        try {

            const rolePermissionExist = await RolePermissionService.getAllByRoleId(roleId);

            if (rolePermissionExist.length > 0) {
                await RolePermissionService.deleteByRoleId(roleId);
            }
            
            for (const permissionId of permissionIds) {

                const permissionExist = await PermissionService.getOneById(permissionId.id);

                if (!permissionExist) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Permission ${permissionId.id} tidak ditemukan`
                    });
                }
                
                await RolePermissionService.assign({
                    roleId,
                    permissionId: permissionId.id
                });
    
            }
            
            res.status(201).json({
                status: 'success',
                message: 'Data role permission berhasil ditambahkan',
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal menambah data role permission' });

        }
    }

    static async assign(req: Request, res: Response) {

        const { roleId } = req.params;

        if (!roleId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id role wajib diisi'
            });
        }

        const { permissionId } = req.body;

        const v = new Validator();

        const schema = {
            permissionId: { type: "string", empty: false }
        };

        const check = v.compile(schema);

        const validationResponse = check({ permissionId });

        if (validationResponse !== true) {
            return res.status(400).json({
                status: 'error',
                message: validationResponse
            });
        }
        
        try {

            const permissionExist = await PermissionService.getOneById(permissionId);

            if (!permissionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Permission tidak ditemukan'
                });
            }
            
            await RolePermissionService.assign({
                roleId,
                permissionId
            });
            
            res.status(201).json({
                status: 'success',
                message: 'Data role permission berhasil ditambahkan',
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal menambah data role permission' });

        }
    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const rolePermissionExist = await RolePermissionService.getOneById(id);

            if (!rolePermissionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role permission tidak ditemukan'
                });
            }

            const data = await RolePermissionService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data role permission berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal hapus data role permission' });

        }
    }

}