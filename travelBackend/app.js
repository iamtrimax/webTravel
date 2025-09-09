const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./src/Route/routes");
const connectMongoDb = require("./src/config/dbConfig");
const errorHandler = require("./src/middleware/errorHandler");
const app = express();
const PORT = 3000;
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173", // Đúng với frontend
    credentials: true, // Quan trọng!
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", route);
app.use(errorHandler);
connectMongoDb().then(
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
);
