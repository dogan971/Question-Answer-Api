const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routes/index.js");
const customError = require("./middleware/errors/customError");
const connectDatabase = require("./helpers/database/connectDatabase");
const path = require("path");
const { dirname } = require("path");
// Environment Variables
dotenv.config({
  path: "./config/env/config.env",
});

// MongoDB Connection
connectDatabase();

const app = express();
//Express - Body MiddleWare
app.use(express.json());
const PORT = process.env.PORT;

// Routes Middleware
app.use("/api", routers);
app.use(customError);

// static files

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Server Started on " + PORT + ":" + process.env.NODE_ENV);
});
