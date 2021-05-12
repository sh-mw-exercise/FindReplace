import "jasmine";
import { ReplaceRegexp } from "../src/replace";

describe("replace tests", () => {

   const replace = new ReplaceRegexp();
   const blankText = 'XXXX';

   it("Should replace all occurances", () => {
      const replacements = [
         "HELLO"
      ]

      const text ='HELLO HELLO HELLO';

      const redactedText = replace.replace(replacements, text, blankText);

      expect(redactedText).toBe(`${blankText} ${blankText} ${blankText}`);
   });

   it("Should ignore case during replacement", () => {
      const replacements = [
         "HELLO"
      ]

      const text ='HELLO hello HeLlO';

      const redactedText = replace.replace(replacements, text, blankText);

      expect(redactedText).toBe(`${blankText} ${blankText} ${blankText}`);
   });

   it("Should replace all strings in the array", () => {
      const replacements = [
         "Hello",
         "World",
         "Boston Red Sox",
         "Pepperoni Pizza",
         "Cheese Pizza",
         "beer"
      ]

      const text = `When I went to see the Boston Red Sox, I thought to my self
      Hello look at all the Pepperoni Pizza, and Cheese Pizza, what a World I
      should get a beer for myself.`

      const redactedText = replace.replace(replacements, text, blankText);

      expect(redactedText).toBe(`When I went to see the ${blankText}, I thought to my self
      ${blankText} look at all the ${blankText}, and ${blankText}, what a ${blankText} I
      should get a ${blankText} for myself.`)
   });
});
