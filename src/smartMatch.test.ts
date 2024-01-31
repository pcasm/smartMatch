import { TextRange, smartMatch } from "./smartMatch";

/**
 * Helper for better readability of expected text ranges.
 * @example
 * - createRanges("{P}aco {t}he {Luc}ia") => [{from: 0, to: 0], [from: 5, to: 5], [from: 9, to: 11]}
 */
function createRanges(str: string): TextRange[] {
  const regExp = /{.*?}/g;
  let visitedBraces = 0;
  let result;
  const ranges: TextRange[] = [];
  // eslint-disable-next-line no-cond-assign
  while ((result = regExp.exec(str))) {
    const { 0: match, index } = result;
    const from = index - visitedBraces;
    const to = from + match.length - 3;
    ranges.push({
      from,
      to
    });
    visitedBraces += 2;
  }
  return ranges;
}

describe("findInText", () => {
  it("finds simple matches", () => {
    const ranges = smartMatch("Paco de lucia", "lucia");
    expect(ranges).toEqual(createRanges("Paco de {lucia}"));
  });

  it("is case insensitive", () => {
    const ranges = smartMatch("Paco de lucia", "paco");
    expect(ranges).toEqual(createRanges("{Paco} de lucia"));
  });

  it("ignores spaces or non-alphanumeric chars", () => {
    expect(smartMatch("Paco de lucia", "pacode")).toEqual(
      createRanges("{Paco} {de} lucia")
    );
    expect(smartMatch("Vicente-Amigo", "VicenteAm")).toEqual(
      createRanges("{Vicente}-{Am}igo")
    );
    expect(smartMatch("Vicente_Amigo", "VicenteAm")).toEqual(
      createRanges("{Vicente}_{Am}igo")
    );
    expect(smartMatch("Vicente.Amigo", "VicenteAm")).toEqual(
      createRanges("{Vicente}.{Am}igo")
    );
  });

  it("matches when initial parts of words are typed", () => {
    const ranges = smartMatch("myCoolFunction.test.ts", "mcofuntt");
    expect(ranges).not.toEqual(null);
    expect(ranges).toEqual(createRanges("{m}y{Co}ol{Fun}ction.{t}est.{t}s"));
  });

  it("merges immediate ranges", () => {
    const ranges = smartMatch("someThing", "someTh");
    expect(ranges).not.toEqual(null);
    expect(ranges).toEqual(createRanges("{someTh}ing"));
  });

  it("Prioritizes finding a full match over matching continuously", () => {
    const ranges = smartMatch("wccj-130-css-module-types", "wccs");
    expect(ranges).not.toEqual(null);
    expect(ranges).toEqual(createRanges("{wc}cj-130-{cs}s-module-types"));
  });
});
