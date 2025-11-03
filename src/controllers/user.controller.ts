import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class UserController {
  static async create(req: Request, res: Response) {

    const {email, password, roleId} = req.body

    try {

    const v = new Validator();

    const schema = {
        email: { type: "email"},
        password: { type: "string", min: 8 },
        roleId: { type: "string" }
    };

    const check = v.compile(schema);

    const validationResponse = check({ email, password, roleId });

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

    const data = await UserService.create({email, password, roleId});

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

    const {search, page, limit} = req.query as {search?: string, page?: number, limit?: number};

    try {
      
      const data = await UserService.getAll(search, page, limit);
      
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
    const {email, password, roleId} = req.body;

    try {

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

      const data = await UserService.update(id, {email, password, roleId});
      
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

}