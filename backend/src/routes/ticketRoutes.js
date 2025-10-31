import express from "express";
import {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  updateTicket,
} from "../controllers/ticketController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee
router.post("/", protect, authorizeRoles("employee"), createTicket);
router.get("/my", protect, authorizeRoles("employee"), getMyTickets);

// IT Support
router.get("/assigned", protect, authorizeRoles("it_support"), getAssignedTickets);
router.put("/:id", protect, authorizeRoles("it_support", "admin"), updateTicket);

export default router;
