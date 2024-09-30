const { tokenize } = require("../src/tokeniser");
describe("tokenize", () => {
  test("single token input", () => {
    const input = "print";
    const tokens = tokenize(input);
    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe("keyword");
  });
  test("multiple tokens input", () => {
    const input = " printprint";
    const tokens = tokenize(input);
    expect(tokens.length).toBe(2);
  });
  test("dealing with whitespaces", () => {
    const input = " print    print";
    const tokens = tokenize(input);
    expect(tokens.length).toBe(2);
  });
  test("dealing with unrecognized token", () => {
    expect(() => {
      const input = " print foo   print";
      tokenize(input);
    }).toThrowError("Unexpected token f");
  });
  test("multiple mixed tokens", () => {
    const input = " print 2";
    const tokens = tokenize(input);
    expect(tokens.length).toBe(2);
    expect(tokens[0].type).toBe("keyword");
    expect(tokens[1].type).toBe("number");
  });
});