import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import customerRoutes from "./routes/customerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((value) => value.trim())
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1);
});
