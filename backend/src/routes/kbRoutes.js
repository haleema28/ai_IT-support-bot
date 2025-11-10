// import express from "express";
// import multer from "multer";
// import { ingestText, ingestPdf } from "../controllers/kbController.js";

// const upload = multer({ dest: "uploads/" });
// const router = express.Router();

// router.post("/text", ingestText);
// router.post("/pdf", upload.single("file"), ingestPdf);

// export default router;
import express from "express";
import multer from "multer";
import {
  ingestText,
  ingestPdf,  
} from "../controllers/kbController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Separate routes (if you prefer)
router.post("/text", ingestText);
router.post("/pdf", upload.single("file"), ingestPdf);



export default router;
