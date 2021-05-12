import http from "http";
import { ChildProcess, exec, execSync, spawn } from "child_process";
import { parse } from "path";

const magenta = "\u001b[35m";
const cyan = "\u001b[36m";
const white = "\u001b[37m";

// Build Services
console.log(magenta);
console.log("Build Services");

// Spin up process for first build
console.log(cyan)
console.log("Build Parser");
console.log(white)
process.chdir("../parse");
console.log(process.cwd());
const parserBuildBuffer = execSync("npm run build");
console.log(parserBuildBuffer.toString());

// Spin up process for second build
console.log(cyan)
console.log("Build Replace");
console.log(white)
process.chdir("../replace");
console.log(process.cwd());
const replaceBuildBuffer = execSync("npm run build");
console.log(replaceBuildBuffer.toString());

// Spin up process for second build
console.log(cyan)
console.log("Build App Redact");
console.log(white)
process.chdir("../app");
console.log(process.cwd());
const redactBuildBuffer = execSync("npm run build");
console.log(redactBuildBuffer.toString());

// Running Unit Tests
console.log(magenta);
console.log("Running Unit Tests");

// Spin up process for first set of tests
console.log(cyan)
console.log("Running Tests For Parser");
console.log(white)
process.chdir("../parse");
console.log(process.cwd());
const parserBuffer = execSync("npm run test");
console.log(parserBuffer.toString());

// Spin up process for next set of tests
console.log(cyan);
console.log("Running Tests For Replace");
console.log(white)
process.chdir("../replace");
console.log(process.cwd());
const replaceBuffer = execSync("npm run test");
console.log(replaceBuffer.toString());

// Start up the set of services
console.log(magenta);
console.log("Starting services...");
console.log("Starting Replace Service")

const parseServicePromise = new Promise((resolve, reject) => {
   // parse service startup
   process.chdir("../parse");
   console.log("Starting Parse Service")
   const parseProc = exec("npm run start");
   parseProc.stdout.on('data', (d: string) => {
      if (d.includes("Server listening")) {
         resolve(parseProc);
      }
   });
   parseProc.stderr.on("data", d => console.error(d));
});

const replaceServicePromise = new Promise((resolve, reject) => {
   // replace service startup
   process.chdir("../replace");
   console.log("Starting Replace Service")
   const replaceProc = exec("npm run start");
   replaceProc.stdout.on('data', (d: string) => {
      if (d.includes("Server listening")) {
         resolve(replaceProc);
      }
   });
   replaceProc.stderr.on("data", d => console.error(d));
});

const redactServicePromise = new Promise((resolve, reject) => {
   // app redact service setup
   process.chdir("../app");
   console.log("Starting App Redact Service")
   const appProc = exec("npm run start");
   appProc.stdout.on('data', (d: string) => {
      if (d.includes("Server listening")) {
         resolve(appProc);
      }
   });
   appProc.stderr.on("data", d => console.error(d));
});

// run the integration tests
const integrationTests = (): Promise<string> => {

   return new Promise((resolve, reject) => {

      const redactRequst = http.request("http://localhost:3000/api/v1/redaction",
         {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
         }, (redactRes) => {
            if (redactRes.statusCode !== 200) {
               reject(redactRes.statusMessage);
            } else {
               const output = new Array<string>();

               redactRes.on('data', (chunk) => {
                  output.push(chunk);
               });

               redactRes.on('end', () => {
                  const returned = output.join("");
                  resolve(returned);
               });
            }
         }
      );

      const toWrite =
      {
         "redactionStrings": "Hello world \"Boston Red Sox\",'Pepperoni Pizza','Cheese Pizza',beer",
         "originalText": "cheese pizza This BOSTON RED SOX is world world the worLd hello original pepperoni pizza text beer"
      };

      console.log("Writing: ", toWrite);

      redactRequst.write(
         JSON.stringify(
            toWrite
         )
      );

      redactRequst.end();
   });
}

// expected output
const expected = "XXXX This XXXX is XXXX XXXX the XXXX XXXX original XXXX text XXXX"

// give some user feedback while we wait
console.log(white);
const i = setInterval(() => process.stdout.write('.'), 200);

let childProcessList: ChildProcess[];

Promise.all([parseServicePromise, replaceServicePromise, redactServicePromise])
   .then((d: any) => childProcessList = d)
   .then(() => clearInterval(i))
   .then(() => {
      console.log();
      console.log();
      console.log(cyan);
      console.log("Running integration tests...");
      console.log(white);
   })
   .then(() => integrationTests())
   .then((replaced: string) => {
      console.log();
      console.log(cyan);
      console.log("Expected: ", expected);
      console.log("Replaced: ", replaced);
      console.log(replaced === expected ? "PASS" : "FAIL");
   })
   .then(() => {
      if (process.platform === 'win32') {
         childProcessList.forEach((cp) => {
            spawn("taskkill", ["/pid", cp.pid.toString(), '/f', '/t']);
         });
      } else {
         childProcessList.forEach((cp) => {
            process.kill(cp.pid);
         });
      }
   });



