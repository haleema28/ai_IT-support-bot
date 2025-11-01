import express from "express";
import multer from "multer";
import { ingestText, ingestPdf } from "../controllers/kbController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/text", ingestText);
router.post("/pdf", upload.single("file"), ingestPdf);

export default router;
