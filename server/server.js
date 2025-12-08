import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//Root route
app.get("/", (req, res) => {
  res.send("Backend is live!");
});

app.listen(PORT, () => {
  console.log("Server is UP!");
});
