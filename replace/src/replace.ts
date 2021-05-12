export class ReplaceRegexp {

   /**
    * Replace all occurances of replaceCandidate in originalText with replaceWith
    * then return the transformed text.
    * @param replaceCandidates a list of candidates that will be replaced in the originalText
    * @param originalText the original text that will be transformed
    * @param replaceWith the string that will be substituted
    * @returns transformed originalText with all occurances of replaceCandidates substituted by replaceWith
    */
   public replace(replaceCandidates: string[], originalText: string, replaceWith: string): string {

      const replaceCandidateExpression = replaceCandidates.join('|');
      const regexp = new RegExp(replaceCandidateExpression, 'ig');
      const toRtn = originalText.replace(regexp, replaceWith);

      return toRtn;
   }
}