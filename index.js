const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Resume = require("./models/resumeModel");
const app = express();
const cors = require("cors");
const OpenAI = require("openai");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const puppeteer = require("puppeteer");
dotenv.config({ path: "./.env" });

const openai = new OpenAI({
  organization: "org-pDUEKTSP6zdjnwVK57S4AyfL",
  apiKey: process.env.OPENAI_API_KEY,
});

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

const DB = process.env.DATABASE;
app.use(express.json());
//console
mongoose
  .connect(
    "mongodb+srv://amolverma:iloveicecream.9@cluster0.mplpzcy.mongodb.net/resumeAnalyzer",
    {}
  )
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

app.post("/askai", async function (req, res) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "You are a Resume Analyser." },
      {
        role: "user",
        content: `This is a resume for ${
          req.body.profile ? req.body.profile : ""
        }. The Content of the Resume is as follows : ${
          req.body.content ? req.body.content : ""
        } for ${
          req.body.company ? req.body.company : ""
        }. Give me a full detailed and comprehensive analysis about the
            resume , regarding how it can be improved , based on the provided input data. Use example from input data to show the result.Strictly give an well designed HTML output of the analysed report , so that I can render
            on my website , with good styling [Note - Dont add any supporting text , just focus on the result, dont add newline in output].Use below format as demo, for analysis report

  Resume Analysis Report - Amol Verma
  Personal Information

  Name: Amol Verma

  Profile: Software Developer

  Summary: A passionate software developer and engineer. Motivated to learn more in a collaborative environment.

  Skills: MongoDB, SQL, PostgreSQL, React.js, Next.js, TailwindCSS

  Improvement:

      Skills should be categorized (e.g., Front-End, Back-End, Database) for clarity.
      Email address and phone should be made clickable for easy contact.

  Projects
  1. Acadhut - An education oriented social media

  Description: Made with Redux, MERN, TailwindCSS.
  2. Facebook Clone

  Description: Made with Redux, MERN, TailwindCSS.

  Improvement:

      Include specifics about the role undertaken in the projects and features implemented.
      Adding GitHub links for project codebase can enhance credibility and showcase practical skills.

  Education

  12th: 76.2% - Details about the institution or relevant coursework should be provided.

  11th: 72% - It's unusual to list grades from individual school years without context. Consider including significant achievements or coursework.

  Improvement:

      Update educational qualifications with information about your degree or recent relevant certifications.

  Work Experience

  Improvement:

      Replace generic placeholders with actual job titles and descriptions.
      Highlight responsibilities, technologies used, and accomplishments in each role.

  Awards

  Improvement:

      Actual awards and recognitions should be listed to boost the profile's strength.

  `,
      },
    ],
  });

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(response.choices[0].message.content);

  await page.pdf({ path: "./reports/example2.pdf", format: "A4" });

  await browser.close();

  res.download("reports/example2.pdf");
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
