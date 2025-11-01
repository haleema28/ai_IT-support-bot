import KbDocument from "../models/KbDocument.js";
import { embedText, addVector, saveIndex } from "../utils/faissUtils.js";

import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


const chunkText = (text, size = 1000, overlap = 200) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

export const ingestText = async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }
    
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      if (chunk.trim()) {
        const vec = await embedText(chunk);
        const kbDoc = await KbDocument.create({ title, text: chunk });
        await addVector(vec, { 
          text: chunk, 
          title: title || "Untitled",
          _id: kbDoc._id.toString()
        });
      }
    }
    saveIndex();
    res.status(201).json({ message: "Text ingested", chunks: chunks.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const ingestPdf = async (req, res) => {
  try {
    const data = await pdfParse(fs.readFileSync(req.file.path));
    fs.unlinkSync(req.file.path);
    req.body.title = req.file.originalname;
    req.body.text = data.text;
    return ingestText(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
