# FindReplace
This is an exercise to do find-replace.

Dependencies are:
   * GitBash if you are on Windows to run `init.sh`
   * Node
   * npm

To initialize either run `bash init.sh` *or* change directory into each of the subdirectories and run `npm i`:
   * app
   * parse
   * replace
   * test

## ./app
Is an aggregate calling into **parse** and **replace**. 
   * `app/src/index.ts` for webserver

## ./parse
Takes a string and returns a list of strings.
   * `parse/src/parser.ts` for parsing logic
   * `parse/src/index.ts` for webserver
   * `parse/spec/parser-spec.ts` for `parser.ts` unit tests

## ./replace
Takes a list of strings to find, a string to be transformed by replacement, and a string to replace each found occurance.
   * `replace/src/replace.ts` for replace logic
   * `replace/src/index.ts` for webserver
   * `replace/spec/redact-spec.ts` for `replace.ts` unit tests

## ./test
Is a script to build all services then, run all unit and integration tests. Run by `cd test` then `npm run start`. 
