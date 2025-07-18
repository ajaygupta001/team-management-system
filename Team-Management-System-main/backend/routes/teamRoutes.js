import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  getTeams,
} from "../controllers/teamController.js";
const teamRoutes = express.Router();

// teamRoutes.post("/", protect, authorize(["Admin"]), createTeam);
// teamRoutes.get("/", protect, getTeams);
// teamRoutes.put("/:id", protect, authorize(["Admin"]), updateTeam);
// teamRoutes.delete("/:id", protect, authorize(["Admin"]), deleteTeam);

teamRoutes.post("/", protect, authorize(["Admin"]), createTeam);
teamRoutes.put("/:id", protect, authorize(["Admin"]), updateTeam);
teamRoutes.get("/", protect, getTeams);
teamRoutes.delete("/:id", protect, authorize(["Admin"]), deleteTeam);
teamRoutes.post("/:id/members", protect, authorize(["Admin"]), addMember);
teamRoutes.delete(
  "/:id/members/:memberId",
  protect,
  authorize(["Admin"]),
  removeMember
);

export default teamRoutes;
