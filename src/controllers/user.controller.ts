import { RoleService } from '@/services/role.service';
import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import bcrypt from 'bcrypt';
import { empty } from '@prisma/client/runtime/client';

export class UserController {
  static async create(req: Request, res: Response) {

    const { email, password, roleId, positionId } = req.body

    try {

      const v = new Validator();

      const schema = {
        email: { type: "email" },
        password: { type: "string", min: 8 },
        roleId: { type: "string", optional: true, empty: false },
        positionId: { type: "string", optional: true, empty: false }
      };

      const check = v.compile(schema);

      const validationResponse = check({ email, password, roleId, positionId });

      if (validationResponse !== true) {
        return res.status(400).json({
          status: 'error',
          message: validationResponse
        });
      }

      const emailExist = await UserService.getOneByEmail(email);

      if (emailExist) {
        return res.status(400).json({
          status: 'error',
          message: 'Email sudah terdaftar'
        });
      }

      const roleExist = await RoleService.getOneById(roleId);

      if (!roleExist) {
        return res.status(400).json({
          status: 'error',
          message: 'Role tidak ditemukan'
        });
      }

      if(positionId) {
        const positionExist = await RoleService.getOneById(positionId);

        if (!positionExist) {
          return res.status(400).json({
            status: 'error',
            message: 'Posisi tidak ditemukan'
          });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const data = await UserService.create({ email, password: hashedPassword, roleId, positionId });

      const { password: _pass, ...user } = data;

      res.status(201).json({
        status: 'success',
        message: 'User berhasil dibuat',
        data: user
      })

    } catch (error) {

      console.log(error);

      return res.status(500).json({ error: 'Gagal membuat user' });

    }
  }

  static async getAll(req: Request, res: Response) {

    const { search, page, limit, roleId, areaId, fractionId } = req.query as { search?: string, page?: number, limit?: number, roleId?: string, areaId?: string, fractionId?: string };

    try {

      const data = await UserService.getAll(search, Number(page), Number(limit), roleId, areaId, fractionId);

      res.status(200).json({
        status: 'success',
        message: 'Data user berhasil didapatkan',
        data: data.data,
        totalData: data.totalData,
        totalPage: data.totalPages
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({ error: 'Gagal mendapatkan data user' });

    }
  }

  static async getOneById(req: Request, res: Response) {

    const { id } = req.params;

    try {

      const data = await UserService.getOneById(id);

      res.status(200).json({
        status: 'success',
        message: 'Data user berhasil didapatkan',
        data
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({ error: 'Gagal mendapatkan data user' });

    }
  }

  static async update(req: Request, res: Response) {

    const { id } = req.params;
    const { email, password, roleId, positionId } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Id wajib diisi'
      });
    }

    try {

      const v = new Validator();

      const schema = {
        email: { type: "email" },
        password: { type: "string", min: 8 },
        roleId: { type: "string", optional: true, empty: false },
        positionId: { type: "string", optional: true, empty: false }
      };

      const check = v.compile(schema);

      const validationResponse = check({ email, password, roleId, positionId });

      if (validationResponse !== true) {
        return res.status(400).json({
          status: 'error',
          message: validationResponse
        });
      }

      const userExist = await UserService.getOneById(id);

      if (!userExist) {
        return res.status(400).json({
          status: 'error',
          message: 'User tidak ditemukan'
        });
      }

      const emailExist = await UserService.getOneByEmail(email, id);

      if (emailExist) {
        return res.status(400).json({
          status: 'error',
          message: 'Email sudah terdaftar'
        });
      }

      if (roleId) {

        const roleExist = await RoleService.getOneById(roleId);

        if (!roleExist) {
          return res.status(400).json({
            status: 'error',
            message: 'Role tidak ditemukan'
          });
        }

      }

      if (positionId) {

        const positionExist = await RoleService.getOneById(positionId);

        if (!positionExist) {
          return res.status(400).json({
            status: 'error',
            message: 'Posisi tidak ditemukan'
          });
        }

      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await UserService.update(id, { email, password: hashedPassword, roleId, positionId });

      const { password: _pass, ...data } = updatedUser;

      res.status(200).json({
        status: 'success',
        message: 'Data user berhasil diupdate',
        data
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({ error: 'Gagal update data user' });

    }
  }

  static async delete(req: Request, res: Response) {

    const { id } = req.params;

    try {

      const userExist = await UserService.getOneById(id);

      if (!userExist) {
        return res.status(400).json({
          status: 'error',
          message: 'User tidak ditemukan'
        });
      }

      const data = await UserService.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Data user berhasil dihapus',
        data
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({ error: 'Gagal hapus data user' });

    }
  }

  static async getStructural(req: Request, res: Response) {
    try {
      const structural = await UserService.getStructural();

      const grouped: {
        pimpinan: Record<
          string,
          {
            id: string;
            name: string;
            email: string;
            positionCategory: string;
            positionId: string;
            position: string;
            level: string;
          }[]
        >;

        komisi: Record<
          string,
          Record<
            string,
            {
              id: string;
              name: string;
              email: string;
              positionCategory: string;
              positionId: string;
              position: string;
              level: string;
              commissionId: string;
              commission: string;
            }[]
          >
        >;
      } = {
        pimpinan: {
          ketua: [],
          wakil: [],
          sekretaris: [],
          anggota: [],
        },
        komisi: {},
      };

      structural.leaders.forEach((user) => {
        const level = user.position?.level;
        if (level && grouped.pimpinan[level]) {
          grouped.pimpinan[level].push({
            id: user.id,
            name: user.profile?.name || '-',
            email: user.email,
            positionCategory: user.position?.category || '-',
            positionId: user.position?.id || '-',
            position: user.position?.name || '-',
            level: user.position?.level || '-',
          });
        }
      });

      structural.commissions.forEach((user) => {
        const commissionName = user.position?.commission?.name || '-';
        const level = user.position?.level;

        if (!grouped.komisi[commissionName]) {
          grouped.komisi[commissionName] = {
            ketua: [],
            wakil: [],
            sekretaris: [],
            anggota: [],
          };
        }

        if (level && grouped.komisi[commissionName][level]) {
          grouped.komisi[commissionName][level].push({
            id: user.id,
            name: user.profile?.name || '-',
            email: user.email,
            positionCategory: user.position?.category || '-',
            positionId: user.position?.id || '-',
            position: user.position?.name || '-',
            level: user.position?.level || '-',
            commissionId: user.position?.commission?.id || '-',
            commission: user.position?.commission?.name || '-',
          });
        }
      });

      return res.status(200).json({
        status: 'success',
        message: 'Struktur berhasil didapatkan',
        data: grouped,
        total: structural.total
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mendapatkan struktur',
      });
    }
  }

}