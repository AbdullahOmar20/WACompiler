const testCases = [
    {name: "empty program", input: "", output: [] as any[] },
    {name: "one statement", input: "print 1", output: [1]},
    {name: "multiple statements", input: "print 1 print 2", output: [1,2]},
    {
        name: "binary expressions",
        input: "print(2+ 4)",
        output: [6]
    },
    {
        name: "nested binary expressions",
        input: "print ((6-4)+10)",
        output: [12]
    },
    {
        name: "variable declaration",
        input: "var x = 1 print x",
        output: [1]
    },
    {
        name: "float declaration",
        input: "var x = 1.1 print x",
        output: [1.1]
    }
];
test.skip("skip", ()=>{});
export default testCases;