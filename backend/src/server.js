import app from "./app.js";
import connectDB from "./config/db.js";
import { loadFromDatabase } from "./utils/faissUtils.js";
import KbDocument from "./models/KbDocument.js";

const PORT = process.env.PORT || 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error(err.stack);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error(err.stack);
  process.exit(1);
});

// Initialize and start server
const startServer = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await connectDB();
    
    console.log("🔄 Loading knowledge base...");
    try {
      await loadFromDatabase(KbDocument);
    } catch (kbError) {
      console.warn("⚠️ Warning: Could not load knowledge base:", kbError.message);
      console.warn("   Server will continue, but chatbot may not work until KB is loaded");
    }
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 Ready to accept connections`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error(`   Please stop the other server or use a different port`);
        console.error(`   Try: lsof -ti:${PORT} | xargs kill (Mac/Linux)`);
        console.error(`   Or: netstat -ano | findstr :${PORT} (Windows)`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();
