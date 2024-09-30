import { runtime } from "../src/compiler";
import apps from "./testCases.test";

const executeCode = async (code: string) => {
    const output: any[] = [];
    try {
        const tick = await runtime(code, {
            print: d => output.push(d)
        });
        tick();
        return { output };
    } catch (e) {
        console.error(e);
        throw e;  // Let the error propagate
    }
};

describe("compiler", () => {
    apps.forEach(app => {
        test(app.name, async () => {
            const result = await executeCode(app.input);
            expect(result.output).toEqual(app.output);
        });
    });
});
