import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router } from './routes';
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/api', router);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});