require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const userDataRoutes = require("./routes/user-data");
const userRoutes = require("./routes/user");

// express app with cors
const app = express();
app.use(cors());

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/userData", userDataRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect("mongodb://127.0.0.1:27017/talkDB")
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        "connected to db & listening on port",
        process.env.PORT || 5000
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });

// app.get("/api", (req, res) => {
//     res.json({"data": ["data1", "data2", "data3"]})
// })
