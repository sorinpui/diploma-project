require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// express app
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/performances", require("./routes/performanceRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & listening for requests on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
