const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Modern Tech Solutions API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
