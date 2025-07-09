import "dotenv/config";
import app from "./app.js";
import {
  initializeDatabase,
  closeDatabase,
  initStorage,
} from "./config/init.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    await initStorage();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        closeDatabase().then(() => {
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
