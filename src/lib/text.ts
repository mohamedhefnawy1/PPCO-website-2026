/**
 * The source site sets many headings in ALL CAPS. The words stay exactly the same;
 * this only changes their case for display so long headings stay easy to read.
 */
const ACRONYMS = new Set([
  "PPCO", "PPM", "ISO", "LTI", "NEOM", "SPARK", "KAFD", "KFUPM", "RCJY", "SWCC", "OHPL", "CP", "MTC", "FAI", "QA/QC", "JCB", "PSI", "KSA", "SAR",
]);
const SMALL = new Set(["and", "of", "in", "on", "at", "to", "for", "the", "a", "an", "&"]);

export function tc(input: string): string {
  if (input !== input.toUpperCase()) return input; // already mixed case: leave untouched
  return input
    .split(/(\s+)/)
    .map((word, i) => {
      if (/^\s+$/.test(word)) return word;
      const bare = word.replace(/[^A-Z/]/g, "");
      if (ACRONYMS.has(bare)) return word;
      const lower = word.toLowerCase();
      if (i > 0 && SMALL.has(lower)) return lower;
      return lower.replace(/(^|[-/(])([a-z])/g, (_, p, c) => p + c.toUpperCase());
    })
    .join("");
}
