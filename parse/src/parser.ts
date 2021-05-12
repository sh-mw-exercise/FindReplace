/**
 * Grammar for input.
 * Assume λ is equal to empty-string indicating terminal.
 *
 * input -> doubleQuotePhrase | singleQuotePhrase | keywords
 * doubleQuotePhrase -> "nonDoubleQuoteChars" λ | "nonDoubleQuoteChars" DELIMITER input // nonDoubleQuoteChars are a set of any characters excluding "
 * singleQuotePhrase -> 'nonSingleQuoteChars' λ | 'nonSingleQuoteChars' DELIMITER input // nonSingleQuoteChars are a set of any characters excluding '
 * keywords -> nonDelimeterChars λ | nonDelimeterChars DELIMITER input // nonDelimeterChars are a set of any characters excluding DELIMITER
 * DELIMITER -> SPACE | , // assume SPACE is a single space character
 */
export class Parser {

   private static readonly delimiterSpace = " ";
   private static readonly delimiterComma = ",";

   private static readonly singleQuote = "'";
   private static readonly doubleQuote = '"';

   /**
    *
    * @param input String of keywords and phrases:
    * a string of keywords and phrases separated by spaces or commas.
    * Phrases will be enclosed in single or double-quotes.
    *
    * @returns a parsed array of keywords and phrases
    *
    * @throws error if input string is malformed by non matching single or double-quotes.
    */
   public parse(input: string): string[] {
      const index = 0;
      const toRtn = new Array<string>();

      // start the parse routine as long as the string has some length
      if (input.length > 0) {
         this.input(input, index, toRtn);
      }

      return toRtn;
   }

   // input production
   private input(input: string, index: number, strings: string[]) {
      // if double quote then doubleQuotePhrase
      if(input[index] === Parser.doubleQuote) {
         this.doubleQuotePhrase(input, index, strings);
      }
      // if single quote then singleQuotePhrase
      else if (input[index] === Parser.singleQuote) {
         this.singleQuotePhrase(input, index, strings);
      }
      // if not single or double quote then must be a keyword
      else {
         this.keyword(input, index, strings);
      }
   }

   // single quote phrase production
   private singleQuotePhrase(input: string, index: number, strings: string[]) {
      this.phraseHelp(input, index, strings, Parser.singleQuote, "single");
   }

   // double quote phrase production
   private doubleQuotePhrase(input: string, index: number, strings: string[]) {
      this.phraseHelp(input, index, strings, Parser.doubleQuote, "double");
   }

   // helper for common phrase code
   private phraseHelp(input: string, index: number, strings: string[], whichQuote: string, errorString: string) {
      // must run until consuming next quote
      let i = index;
      do {
         i += 1;
         // unclosed double quote
         if (i === input.length) {
            this.error(`index :${i} is out of bounds, expected: ${errorString} closing quote in ${errorString} quote phrase parse`);
         }
      }
      while (input[i] !== whichQuote);

      // avoid empty string case - for example ""
      if (index + 1 !== i) {
         const toAdd = input.substring(index + 1, i)
         strings.push(toAdd);
      }

      // increment consuming quote
      i += 1;

      // return if at the end
      if (i === input.length) {
         return;
      }
      // if delimiter consume and call input
      else if (input[i] === Parser.delimiterComma || input[i] === Parser.delimiterSpace) {
         i += 1;
         this.input(input, i, strings);
      }
      // otherwise error missing delimeter
      else {
         this.error(`Expected valid delimeter at index ${i} in ${errorString} quote phrase parse`);
      }
   }

   // keyword production
   private keyword(input: string, index: number, strings: string[]) {
      let i = index;

      // must have at least one non-delimiter character
      // dangling delimeter
      if (i === input.length) {
         this.error(`Unexpected end of input`);
      }

      // consume
      while (i !== input.length && input[i] !== Parser.delimiterSpace && input[i] !== Parser.delimiterComma) {
         i += 1;
      }

      // if i is the length of the string then we are at a terminal
      if (i === input.length) {
         const toAdd = input.substring(index, i);
         strings.push(toAdd);
         return;
      }
      // otherwise if char at i is not another delimeter
      else if (index !== i) {
         const toAdd = input.substring(index, i);
         strings.push(toAdd);
         // consume delimeter
         i += 1;
         this.input(input, i, strings);
      }
      // otherwise must be a consecutive delimeter call error
      else {
         this.error(`Expected non-delimeter character at index ${i} in keyword parse`);
      }
   }

   // error situation
   private error(errorString: string) {
      throw errorString;
   }

}