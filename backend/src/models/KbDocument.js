import mongoose from "mongoose";

const kbSchema = new mongoose.Schema({
  title: String,
  text: String,        // chunked text
  docId: String,       // document name/id
  vectorId: Number,    // FAISS label
  metadata: Object
}, { timestamps: true });

export default mongoose.model("KbDocument", kbSchema);
