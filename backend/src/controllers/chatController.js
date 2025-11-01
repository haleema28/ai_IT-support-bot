// src/controllers/chatbotController.js
import { searchSimilar } from "../utils/faissUtils.js";
import nlp from "compromise";
import { createTicketHelper } from "./ticketController.js";

export const askBot = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const trimmedQuery = query.trim();

    // Search your local FAISS-like embeddings
    const results = await searchSimilar(trimmedQuery, 0.2); // Lower threshold for better results

    if (!results || results.length === 0) {
      // Auto-create ticket when no results found
      try {
        // Use query as title, truncate to 100 characters if needed
        const ticketTitle = trimmedQuery.length > 100 
          ? trimmedQuery.substring(0, 97) + "..." 
          : trimmedQuery;
        
        const ticket = await createTicketHelper(
          req.user._id,
          ticketTitle,
          trimmedQuery
        );

        return res.status(200).json({
          reply: `I couldn't find a solution in the knowledge base. I've automatically created a support ticket for you. Our IT team will get back to you soon.`,
          ticketCreated: true,
          ticket: {
            id: ticket._id,
            title: ticket.title,
            status: ticket.status,
            assignedTo: ticket.assignedTo ? "IT Support Team" : null
          }
        });
      } catch (ticketError) {
        console.error("Error creating ticket:", ticketError);
        return res.status(200).json({
          reply: "I couldn't find anything in the knowledge base, and I encountered an error while creating a ticket. Please try creating a ticket manually or contact IT support directly.",
          ticketCreated: false,
          error: "Failed to create ticket"
        });
      }
    }

    // ✅ Extract and summarize best-matched document using compromise
    const topResult = results[0];

    // Get relevant sentences from the matched text
    const doc = nlp(topResult.doc.text);
    const sentences = doc.sentences().out("array");
    const summary = sentences.slice(0, 3).join(" "); // Get first 3 sentences

    // Return chatbot-like response with confidence score
    const confidence = (topResult.score * 100).toFixed(0);
    return res.status(200).json({
      reply: `${summary}\n\n(Source: ${topResult.doc.title || "Knowledge Base"})`,
      confidence: `${confidence}%`,
      ticketCreated: false
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Chatbot failed to respond." });
  }
};
