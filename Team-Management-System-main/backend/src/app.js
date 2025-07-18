import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "../config/db.js";
dotenv.config();
import authRoutes from "../routes/authRoutes.js";
import teamRoutes from '../routes/teamRoutes.js';
import projectRoutes from '../routes/projectRoutes.js';

const app = express();
dbConnect();

//middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/projects', projectRoutes);

const Port = process.env.PORT || 5000;

app.listen(Port, async () => {
  console.log(`Server is running on port ${Port}`);
});
