import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
const projectRoutes = express.Router();

projectRoutes.post("/", protect, authorize(["Admin"]), createProject);
projectRoutes.get("/", protect, getProjects);
projectRoutes.put("/:id", protect, authorize(["Admin"]), updateProject);
projectRoutes.delete("/:id", protect, authorize(["Admin"]), deleteProject);

export default projectRoutes;
