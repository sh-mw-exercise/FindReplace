import express from "express";
import { ReplaceRegexp } from "./replace";
import * as dotenv from "dotenv";

// setup for environment variables
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 3002;

// setup express
const app = express();
app.use(express.json());

// can reuse replace
const replace = new ReplaceRegexp();

// interface to represent the body of the replace request
interface ReplaceBody {
   replacementStrings: string[];
   originalText: string;
   replaceText: string;
}

// endpoint for replace
app.post("/api/v1/replace", (req, res) => {
   const replaceBody: ReplaceBody = req.body;
   const transformedText = replace.replace(replaceBody.replacementStrings, replaceBody.originalText, replaceBody.replaceText);
   res.send(transformedText);
});

// start listening at specified port
app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`);
});
