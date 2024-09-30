const {parse} = require("../src/parser");
describe("parser", () => {
    test("Single Statement",()=>{
        const tokens = [
            {type: "keyword", value: "print"},
            {type: "number", value: "1"},
        ];
        const ast = parse(tokens);
        expect(ast.length).toEqual(1);
    });
    test("multiple statements",()=>{
        const tokens = [
            {type: "keyword", value: "print"},
            {type: "number", value: "1"},
            {type: "keyword", value: "print"},
            {type: "number", value: "2"},
        ];
        const ast = parse(tokens);
        expect(ast.length).toEqual(2);
    });
    test("Node checking", ()=>{
        const tokens = [
            {type: "keyword", value: "print"},
            {type: "number", value: "1"},
        ];
        const ast = parse(tokens);
        const node = ast[0];
        expect(node).toEqual({
            type: "printStatement",
            expression: {
                type: "numberliteral",
                value: 1
            }
        });
    });
});