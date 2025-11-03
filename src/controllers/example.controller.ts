import { Request, Response } from 'express';

export class ExampleController {
  static async getAll(req: Request, res: Response) {
    return res.json({ message: 'Example endpoint works!' });
  }
}