import "jasmine";
import { Parser } from "../src/parser";

describe("Parser tests", () => {

   const parser = new Parser();

   it("Should define function called parse().", () => {
      expect(parser.parse).toBeDefined("The function parse() should be defined.");
   });

   it("Should return an empty array if the input is the empty string", () => {
      expect(parser.parse("").length).toBe(0, "The function parse('') should return empty array.");
   });

   it("Should succeed with a single keyword", () => {
      const parms = "Hello";
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello");
   });

   it("Should succeed with one single quote phrase", () => {
      const parms = "'Hello World 42'"
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello World 42");
   });

   it("Should succeed with one double quote phrase", () => {
      const parms = '"Hello World 42"';
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello World 42");
   });

   it("Should succeed with two keywords", () => {
      const parms = "Hello World";
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello");
      expect(values[1]).toBe("World");
   });

   it("Should succeed with two single quote phrases", () => {
      const parms = "'Hello World','42'";
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello World");
      expect(values[1]).toBe("42");
   });

   it("Should succeed with two double quote phrases", () => {
      const parms = '"Hello World","42"';
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello World");
      expect(values[1]).toBe("42");
   });

   it("Should succeed with a mixture of keywords, single quote, and double quote phrases", () => {
      const parms = "Hello world \"Boston Red Sox\",'Pepperoni Pizza','Cheese Pizza',beer";
      const values = parser.parse(parms);

      expect(values[0]).toBe("Hello");
      expect(values[1]).toBe("world");
      expect(values[2]).toBe("Boston Red Sox");
      expect(values[3]).toBe("Pepperoni Pizza");
      expect(values[4]).toBe("Cheese Pizza");
      expect(values[5]).toBe("beer");
   });

   it("Should allow single and double quotes inside of keywords", () => {

      let parms = "Hello\"World\"";
      let values = parser.parse(parms);
      expect(values[0]).toBe(parms);

      parms = "Hello'World'";
      values = parser.parse(parms);
      expect(values[0]).toBe(parms);

      parms = "He\"llo'Wo\"rld'";
      values = parser.parse(parms);
      expect(values[0]).toBe(parms);
   });

   it("Should allow delimiters inside of phrases", () => {

      let parms = "'H,e l,l o,W o,r l,d'";
      let values = parser.parse(parms);
      expect(values[0]).toBe('H,e l,l o,W o,r l,d');

      parms = '"H,e l,l o,W o,r l,d"';
      values = parser.parse(parms);
      expect(values[0]).toBe('H,e l,l o,W o,r l,d');
   });

   it("Should ignore empty phrases", () => {

      let parms = "''";
      let values = parser.parse(parms);
      expect(values.length).toBe(0);

      parms = '""';
      values = parser.parse(parms);
      expect(values.length).toBe(0);
   });

   it("Should fail with unclosed single quote phrase", () => {
      const parms = "'Hello";
      let fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);
   });

   it("Should fail with unclosed double quote phrase", () => {
      const parms = '"Hello';
      let fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);
   });

   it("Should fail with dangling delimeter", () => {
      let parms = 'Hello,';
      let fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = 'Hello ';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = '"Hello World",';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = '"Hello World" ';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = "'Hello World',";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = "'Hello World' ";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);
   });

   it("Should fail with consecutive delimeters", () => {
      let parms = 'Hello, World';
      let fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true);

      parms = 'Hello,,World';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true)

      parms = 'Hello ,World';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true)

      parms = 'Hello  World';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true)
   });

   it("Should fail with missing delimeters", () => {
      let parms = '"Hello""World"';
      let fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "double double");

      parms = "\"Hello\"'World'";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "double single")

      parms = '"Hello"World';
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "double keyword")

      parms = "'Hello'\"World\"";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "single double")

      parms = "'Hello''World'";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "single single")

      parms = "'Hello'World";
      fail = false;
      try {
         const values = parser.parse(parms);
      } catch (e) {
         fail = true;
      }
      expect(fail).toBe(true, "single keyword")
   });
});