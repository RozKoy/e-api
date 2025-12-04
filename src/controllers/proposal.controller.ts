import fs from 'fs';
import { AreaService } from '@/services/area.service';
import { CategoryService } from '@/services/category.service';
import { ProposalService } from '@/services/proposal.service';
import { ProposalStatusService } from '@/services/proposalStatus.service';
import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import path from 'path';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { NotificationService } from '@/services/notification.service';
import ExcelJS from "exceljs";
import { UserAccessService } from '@/services/userAccess.service';
import { RolePermissionService } from '@/services/rolePermission.service';

export class ProposalController {
    static async create(req: AuthenticatedRequest, res: Response) {

        const { areaId, categoryId, title, description, customCategory } = req.body;

        const userId = req.payload?.userId as string;

        const file = req.file;

        const v = new Validator();

        const schema = {
            userId: { type: "string", empty: false },
            areaId: { type: "string", empty: false },
            categoryId: { type: "string", optional: true, empty: false },
            title: { type: "string", empty: false },
            description: { type: "string", empty: false },
            customCategory: { type: "string", optional: true, empty: false }
        };

        let finalPath: string | null = null;

        try {
            const check = v.compile(schema);
            const validationResponse = check({ userId, areaId, categoryId, title, description, customCategory });

            if (validationResponse !== true) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: validationResponse
                });
            }

            if (!categoryId && !customCategory) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "Salah satu kategori wajib diisi"
                });
            }

            const userExist = await UserService.getOneById(userId);
            if (!userExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "User tidak ditemukan"
                });
            }

            const areaExist = await AreaService.getOneById(areaId);
            if (!areaExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "Area tidak ditemukan"
                });
            }

            let finalCategoryId = categoryId || null;
            let finalCustomCategory: string | null = null;

            if (categoryId) {
                const categoryExist = await CategoryService.getOneById(categoryId);
                if (!categoryExist) {
                    if (file) fs.unlinkSync(file.path);
                    return res.status(400).json({
                        status: "error",
                        message: "Kategori tidak ditemukan"
                    });
                }
            }

            if (customCategory) {
                const categoryByName = await CategoryService.getOneByName(customCategory);

                if (categoryId) {
                    finalCustomCategory = null;
                }
                else if (categoryByName) {
                    finalCategoryId = categoryByName.id;
                    finalCustomCategory = null;
                }
                else {
                    finalCategoryId = null;
                    finalCustomCategory = customCategory;
                }
            }

            const data = await ProposalService.create({
                userId,
                areaId,
                categoryId: finalCategoryId,
                status: "baru",
                title,
                description,
                customCategory: finalCustomCategory
            });

            await ProposalStatusService.create({ proposalId: data.id, userId, status: "baru" });

            const fileData: any = {};

            if (file) {
                const finalFolder = path.join(__dirname, "../../uploads/files/proposals", data.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, file.filename);

                fs.renameSync(file.path, finalPath);

                fileData.fileName = file.originalname;
                fileData.filePath = finalPath;
                fileData.fileUrl = `${process.env.APP_URL}/uploads/files/proposals/${data.id}/${file.filename}`;
            }

            await NotificationService.create({ userId: userId, proposalId: data.id, status: "baru" });

            const updatedData = await ProposalService.update(data.id, { fileName: fileData.fileName, filePath: fileData.filePath, fileUrl: fileData.fileUrl });

            return res.status(201).json({
                status: "success",
                message: "Proposal berhasil dibuat",
                data: updatedData
            });

        } catch (err) {

            if (finalPath && fs.existsSync(finalPath)) {
                fs.unlinkSync(finalPath);
            }

            if (file && (!finalPath || !fs.existsSync(finalPath))) {
                fs.unlinkSync(file.path);
            }

            console.error(err);
            return res.status(500).json({
                status: "error",
                message: "Gagal membuat proposal"
            });
        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await ProposalService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data proposal berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data proposal'
            });
        }
    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const data = await ProposalService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data proposal berhasil didapatkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data proposal'
            });
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {

        const { id } = req.params;

        const userId = req.payload!.userId;

        const { areaId, categoryId, title, description, customCategory } = req.body;

        const file = req.file;

        let finalPath: string | null = null;

        const v = new Validator();

        const schema = {
            areaId: { type: "string", empty: false },
            categoryId: { type: "string", optional: true },
            title: { type: "string", empty: false },
            description: { type: "string", empty: false },
            customCategory: { type: "string", optional: true }
        };

        try {
            const check = v.compile(schema);
            const validationResponse = check({ areaId, categoryId, title, description, customCategory });

            if (validationResponse !== true) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: validationResponse
                });
            }

            if (!categoryId && !customCategory) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "Salah satu kategori wajib diisi"
                });
            }

            const proposalExist = await ProposalService.getOneById(id);
            if (!proposalExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(404).json({
                    status: "error",
                    message: "Proposal tidak ditemukan"
                });
            }

            if (proposalExist.userId !== userId) {
                if (file) fs.unlinkSync(file.path);
                return res.status(403).json({
                    status: "error",
                    message: "Anda tidak memiliki izin untuk mengubah proposal ini"
                });
            }

            if (proposalExist.status !== "baru") {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "Proposal sudah diproses"
                });
            }

            const areaExist = await AreaService.getOneById(areaId);
            if (!areaExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: "error",
                    message: "Area tidak ditemukan"
                });
            }

            let finalCategoryId = categoryId || null;
            let finalCustomCategory: string | null = null;

            if (categoryId) {
                const categoryExist = await CategoryService.getOneById(categoryId);
                if (!categoryExist) {
                    if (file) fs.unlinkSync(file.path);
                    return res.status(400).json({
                        status: "error",
                        message: "Kategori tidak ditemukan"
                    });
                }
            }

            if (customCategory) {
                const categoryByName = await CategoryService.getOneByName(customCategory);

                if (categoryId) {
                    finalCustomCategory = null;
                }
                else if (categoryByName) {
                    finalCategoryId = categoryByName.id;
                    finalCustomCategory = null;
                }
                else {
                    finalCategoryId = null;
                    finalCustomCategory = customCategory;
                }
            }

            const fileData: any = {};

            if (file) {

                const oldFilePath = proposalExist.filePath;

                if (oldFilePath && fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log("🗑️ File lama dihapus:", oldFilePath);
                    } catch (err) {
                        console.error("❌ Gagal menghapus file lama:", err);
                    }
                }

                const finalFolder = path.join(__dirname, "../../uploads/files/proposals", proposalExist.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, file.filename);

                fs.renameSync(file.path, finalPath);

                fileData.fileName = file.originalname;
                fileData.filePath = finalPath;
                fileData.fileUrl = `${process.env.APP_URL}/uploads/files/proposals/${proposalExist.id}/${file.filename}`;
            }

            const data = await ProposalService.update(id, {
                areaId,
                categoryId: finalCategoryId,
                title,
                description,
                customCategory: finalCustomCategory,
                fileName: fileData.fileName,
                filePath: fileData.filePath,
                fileUrl: fileData.fileUrl
            });

            return res.status(200).json({
                status: "success",
                message: "Data proposal berhasil diubah",
                data
            });

        } catch (error) {

            if (finalPath && fs.existsSync(finalPath)) {
                fs.unlinkSync(finalPath);
            }

            if (file && (!finalPath || !fs.existsSync(finalPath))) {
                fs.unlinkSync(file.path);
            }

            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Gagal mengubah data proposal"
            });
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;

        const { userId, roleId } = req.payload!;

        try {

            const userPermission = await RolePermissionService.getAllByRoleId(roleId as string);

            const proposalExist = await ProposalService.getOneById(id);

            if (!proposalExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Proposal tidak ditemukan"
                });
            }

            if (proposalExist.userId !== userId && !userPermission.some(permission => permission.permission.name === "Hapus Proposal")) {
                return res.status(403).json({
                    status: "error",
                    message: "Anda tidak memiliki izin untuk menghapus proposal ini"
                });
            }

            if (userId !== proposalExist.userId && proposalExist.status !== "baru") {
                return res.status(400).json({
                    status: "error",
                    message: "Proposal sudah diproses"
                });
            }

            if (proposalExist.filePath && fs.existsSync(proposalExist.filePath)) {
                fs.unlinkSync(proposalExist.filePath);

                const parentFolder = path.dirname(proposalExist.filePath);
                try {
                    if (fs.existsSync(parentFolder)) {
                        fs.rmSync(parentFolder, { recursive: true, force: true });
                    }
                } catch (err) {
                    console.error("Gagal menghapus folder:", err);
                }
            }

            await ProposalStatusService.deleteByProposalId(id);

            const data = await ProposalService.delete(id);

            return res.status(200).json({
                status: "success",
                message: "Data proposal berhasil dihapus",
                data
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Gagal menghapus data proposal"
            });
        }
    }

    static async import(req: AuthenticatedRequest, res: Response) {

        const file = req.file;
        const userId = req.payload!.userId;

        if (!file) {
            return res.status(400).json({
                status: "error",
                message: "File wajib diisi",
            });
        }

        const workbook = new ExcelJS.Workbook();

        try {

            const hasAccess = await UserAccessService.getByUserId(userId);

            if (!hasAccess) {
                return res.status(403).json({
                    status: "error",
                    message: "Anda tidak memiliki akses untuk import data proposal",
                });
            }

            await workbook.xlsx.readFile(file.path);

            const worksheet = workbook.worksheets[0];

            const proposals: any[] = [];

            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {

                const row = worksheet.getRow(rowNumber);

                const categoryCell = row.getCell(2).value;
                const titleCell = row.getCell(3).value;
                const descriptionCell = row.getCell(4).value;

                const category = categoryCell ? String(categoryCell).trim() : "";
                const title = titleCell ? String(titleCell).trim() : "";
                const description = descriptionCell ? String(descriptionCell).trim() : "";

                if (!title) continue; // skip baris kosong

                const categoryExist = await CategoryService.getOneByName(category);

                const proposal = await ProposalService.create({
                    userId,
                    areaId: hasAccess[0].areaId,
                    categoryId: categoryExist ? categoryExist.id : null,
                    customCategory: categoryExist ? null : category,
                    status: "baru",
                    title,
                    description,
                });

                proposals.push(proposal);

            }

            return res.status(201).json({
                status: "success",
                message: "Data proposal berhasil diimpor",
                data: proposals,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Gagal mengimpor data proposal",
            });
        }
    }

    static async export(req: Request, res: Response) {

        const { areaId, startDate, endDate } = req.query as { areaId?: string, startDate?: string, endDate?: string };

        const parsedStartDate = startDate ? new Date(startDate) : undefined;
        const parsedEndDate = endDate ? new Date(endDate) : undefined;

        try {

            const proposals = await ProposalService.getExportData(parsedStartDate, parsedEndDate, areaId);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Data Proposal");

            worksheet.columns = [
                { header: "No", key: "no", width: 5 },
                { header: "Kategori", key: "category", width: 25 },
                { header: "Judul", key: "title", width: 30 },
                { header: "Deskripsi", key: "description", width: 50 },
                { header: "Status", key: "status", width: 15 },
                { header: "Area", key: "area", width: 20 },
                { header: "Like", key: "like", width: 10 },
                { header: "Dislike", key: "dislike", width: 10 },
                { header: "Dibuat Oleh", key: "user", width: 25 },
                { header: "Tanggal Dibuat", key: "createdAt", width: 20 },
                { header: "Link", key: "link", width: 30 },
            ];

            proposals.forEach((p, index) => {
                worksheet.addRow({
                    no: index + 1,
                    category: p.category?.name || p.customCategory || "-",
                    title: p.title,
                    description: p.description,
                    status: p.status.toUpperCase(),
                    area: p.area?.name || "-",
                    like: p.like || 0,
                    dislike: p.dislike || 0,
                    user: p.user?.profile?.name || "-",
                    createdAt: new Date(p.createdAt).toLocaleString("id-ID"),
                    link: p.fileUrl || "-",
                });
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: "center" };

            worksheet.autoFilter = {
                from: "A1",
                to: "H1",
            };

            const buffer = await workbook.xlsx.writeBuffer();

            const now = new Date();
            const dateStr = now.toISOString().split("T")[0];
            const fileName = `proposal_export_${dateStr}.xlsx`;

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
            res.send(buffer);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                status: "error",
                message: "Gagal mengekspor data proposal",
             });
        }

    }

    static async getProposalYears(req: Request, res: Response) {

        try {

            const years = await ProposalService.getProposalYears();

            return res.status(200).json({
                status: "success",
                message: "Data tahun proposal berhasil didapatkan",
                data: years,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Gagal mendapatkan data tahun proposal",
            });
        }
    }
    
}