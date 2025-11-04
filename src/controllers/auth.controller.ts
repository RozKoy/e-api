import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '@/utils/jwt';

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
}