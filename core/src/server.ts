import express from "express";
import { RegisterRoutes } from "./controllers/routes.ts";

const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register tsoa routes
RegisterRoutes(app);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API documentation: http://localhost:${port}/docs`);
});
