const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Resume = require("./models/resumeModel");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
//Catching Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ! Shutting down");
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: "./.env" });
const DB = process.env.DATABASE;
app.use(express.json());
//console
mongoose
  .connect(DB, {})
  .then((con) => {
    // console.log(con.connections);
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) {
      newObj[el] = parseInt(obj[el]);
    }
  });
  return newObj;
};
//Apis

app.post("/createResume", async (req, res) => {
  try {
    const resume = await Resume.create(req.body);
    console.log(resume);
    res.json(resume);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getResumes/:uid", async (req, res) => {
  try {
    const resume = await Resume.find({ userid: req.params.uid });

    res.json(resume);
  } catch (error) {
    console.log(error);
  }
});

//console

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on Port ${port}...`);
});
//Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM recieved .Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated !");
  });
});
