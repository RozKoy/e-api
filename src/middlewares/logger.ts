import { Request, Response, NextFunction } from "express";

export const consoleLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `[${new Date().toLocaleString()}] ${req.method} ${
      req.originalUrl
    } -> ${res.statusCode} (${duration} ms)`;

    console.log(logMessage);
  });

  next();
};
