import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import usersRoute from "./routes/usersRoute.js";
import productsRoute from "./routes/productsRoute.js";
import brandsRoute from "./routes/brandsRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import salesRoute from "./routes/salesRoute.js";
import reportRoutes from "./routes/reportRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//Routes
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/brands", brandsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/sales", salesRoute);
app.use("/api/reports", reportRoutes);

//Root route
app.get("/", (req, res) => {
  res.send("Backend is live!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is UP!");
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

startServer();
