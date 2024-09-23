import { tokenize } from "./tokeniser";
import { parse } from "./parser";
import { emitter } from "./emitter";

export const compile: Compiler = src =>{
    const tokens = tokenize(src);
    const ast = parse(tokens);
    const wasm = emitter(ast);
    return wasm;
};
export const runtime: Runtime = async (src, env) =>{
    const wasm = compile(src);
    const result: any = await WebAssembly.instantiate(wasm, {
        "env": env as { [key: string]: any }
      });
    return () => {
        result.instance.exports.run();
    }
}


