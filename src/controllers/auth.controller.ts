import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '@/utils/jwt';
import { RoleService } from '@/services/role.service';
import { UserProfileService } from '@/services/userProfile.service';

export class AuthController {
    static async login(req: Request, res: Response) {

        const { email, password } = req.body;

        const v = new Validator();

        const schema = {
            email: { type: "email" },
            password: { type: "string", min: 8 }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ email, password });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const userExist = await UserService.getOneByEmail(email);

            if (!userExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email atau password salah'
                });
            }

            const passwordMatch = await bcrypt.compare(password, userExist.password);

            if (!passwordMatch) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email atau password salah'
                });
            }

            const token = await generateAccessToken(userExist.id, userExist.roleId ? userExist.roleId : undefined);

            return res.status(200).json({
                status: 'success',
                message: 'Login berhasil',
                data: token
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal melakukan login' });

        }
    }

    static async register(req: Request, res: Response) {

        const { email, password, name, roleId } = req.body;
    
        const v = new Validator();
    
        const schema = {
          email: { type: "email" },
          password: { type: "string", min: 8 },
          name: { type: "string" },
          roleId: { type: "string", optional: true }
        };
    
        try {
    
          const check = v.compile(schema);
    
          const validationResponse = check({ email, password, name, roleId });
    
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
    
          if (roleId) {
    
            const roleExist = await RoleService.getOneById(roleId);
    
            if (!roleExist) {
              return res.status(400).json({
                status: 'error',
                message: 'Role tidak ditemukan'
              });
            }
    
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const user = await UserService.create({ email, password: hashedPassword, roleId });
    
          const { password: _pass, ...data } = user;
    
          await UserProfileService.create({ userId: user.id, name });
    
          res.status(201).json({
            status: 'success',
            message: 'User berhasil dibuat',
            data
          })
    
        } catch (error) {
    
          console.log(error);
    
          return res.status(500).json({ error: 'Gagal membuat user' });
    
        }
    
      }
}