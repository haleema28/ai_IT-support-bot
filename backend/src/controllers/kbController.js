// import KbDocument from "../models/KbDocument.js";
// import { embedText, addVector, saveIndex } from "../utils/faissUtils.js";

// import fs from "fs";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");


// const chunkText = (text, size = 1000, overlap = 200) => {
//   const chunks = [];
//   for (let i = 0; i < text.length; i += size - overlap) {
//     chunks.push(text.slice(i, i + size));
//   }
//   return chunks;
// };

// export const ingestText = async (req, res) => {
//   try {
//     const { title, text } = req.body;
//     if (!text || !text.trim()) {
//       return res.status(400).json({ error: "Text is required" });
//     }
    
//     const chunks = chunkText(text);
//     for (const chunk of chunks) {
//       if (chunk.trim()) {
//         const vec = await embedText(chunk);
//         const kbDoc = await KbDocument.create({ title, text: chunk });
//         await addVector(vec, { 
//           text: chunk, 
//           title: title || "Untitled",
//           _id: kbDoc._id.toString()
//         });
//       }
//     }
//     saveIndex();
//     res.status(201).json({ message: "Text ingested", chunks: chunks.length });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // export const ingestPdf = async (req, res) => {
// //   try {
// //     const data = await pdfParse(fs.readFileSync(req.file.path));
// //     fs.unlinkSync(req.file.path);
// //     req.body.title = req.file.originalname;
// //     req.body.text = data.text;
// //     return ingestText(req, res);
// //   } catch (e) {
// //     res.status(500).json({ error: e.message });
// //   }
// //};


import fs from "fs";
import pdfParse from "pdf-parse-fixed"; // ✅ ESM-compatible PDF parser
import KbDocument from "../models/KbDocument.js";
import { embedText, addVector, saveIndex } from "../utils/faissUtils.js";

/**
 * Splits text into overlapping chunks for embedding.
 */
const chunkText = (text, size = 1000, overlap = 200) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

/**
 * Ingest plain text into the knowledge base.
 */
export const ingestText = async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const chunks = chunkText(text);
    let savedCount = 0;

    for (const chunk of chunks) {
      if (chunk.trim()) {
        const vec = await embedText(chunk);
        const kbDoc = await KbDocument.create({ title, text: chunk });

        await addVector(vec, {
          text: chunk,
          title: title || "Untitled",
          _id: kbDoc._id.toString(),
        });

        savedCount++;
      }
    }

    saveIndex();

    console.log(`✅ Text ingested successfully (${savedCount} chunks)`);
    res.status(201).json({
      message: "Text ingested successfully",
      chunks: savedCount,
    });
  } catch (e) {
    console.error("❌ Error in ingestText:", e);
    res.status(500).json({ error: e.message });
  }
};

/**
 * Ingest a PDF file into the knowledge base.
 */
export const ingestPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📂 Received file:", req.file);

    const filePath = req.file.path;
    console.log("📖 Reading file at:", filePath);

    const fileBuffer = fs.readFileSync(filePath);
    console.log("✅ File read successfully, size:", fileBuffer.length);

    const data = await pdfParse(fileBuffer);
    console.log("📄 Extracted text length:", data.text?.length || 0);

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    console.log("🗑️ Deleted temp file");

    // Prepare text ingestion
    req.body.title = req.file.originalname;
    req.body.text = data.text;

    return ingestText(req, res);
  } catch (e) {
    console.error("❌ Error in ingestPdf:", e);
    res.status(500).json({ error: e.message });
  }
};



