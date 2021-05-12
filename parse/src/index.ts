import express from "express";
import * as dotenv from "dotenv";
import { Parser } from "../src/parser";

// set for .env file for environment variables
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 3001;

// setup for express to parse payloads to strings
const app = express();
app.use(express.text());

// can use the same parser for all requests
const parser = new Parser();

// parse endpoint
app.post("/api/v1/parse", (req, res) => {
   const parsed = parser.parse(req.body);
   res.json(parsed);
});

// start listening at designated port
app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`);
});
