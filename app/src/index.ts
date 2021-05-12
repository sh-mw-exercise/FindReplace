import express from "express";
import http from "http";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const redactionSubstitue = 'XXXX';

interface AppBody {
   redactionStrings: string;
   originalText: string;
}

app.post("/api/v1/redaction", (req, res) => {

   const appBody: AppBody = req.body;

   // parse
   const makeParseRequest = (): Promise<string[]> => {

      return new Promise((resolve, reject) => {
         let parsed: string[];

         const parseRequst = http.request("http://localhost:3001/api/v1/parse",
            {
               method: 'POST',
               headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'text/plain'
               },
            }, (parseRes) => {

               if (parseRes.statusCode !== 200) {
                  reject(parseRes.statusMessage);
               } else {
                  const output = new Array<string>();

                  parseRes.on('data', (chunk) => {
                     output.push(chunk);
                  });

                  parseRes.on('end', () => {
                     parsed = JSON.parse(output.join(""));
                     resolve(parsed);
                  });
               }
            }
         );

         parseRequst.write(appBody.redactionStrings);
         parseRequst.end();
      });
   };

   // replace
   const makeReplaceRequest = (parsedArray: string[]): Promise<string> => {

      return new Promise((resolve, reject) => {

         let replaced: string = "";

         const replaceRequest = http.request("http://localhost:3002/api/v1/replace",
            {
               method: 'POST',
               headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
               },
            }, (replaceRes) => {

               if (replaceRes.statusCode !== 200) {
                  reject(replaceRes.statusMessage);
               } else {
                  const output = new Array<string>();

                  replaceRes.on('data', (chunk) => {
                     output.push(chunk);
                  });

                  replaceRes.on('end', () => {
                     replaced = output.join("");
                     resolve(replaced);
                  });
               }
            }
         );

         replaceRequest.write(JSON.stringify(
            {
               replacementStrings: parsedArray,
               originalText: appBody.originalText,
               replaceText: redactionSubstitue
            })
         );

         replaceRequest.end();
      });
   };

   makeParseRequest()
      .then(parsedStrings => makeReplaceRequest(parsedStrings))
      .then(replaced => res.send(replaced));
});

app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`);
});
