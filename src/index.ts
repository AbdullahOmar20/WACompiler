declare var CodeMirror: any;
const interpreterRuntime = require("/built/src/interpreter").runtime;
const compilerRuntime = require("/built/src/compiler").runtime;
const { keywords, operators } = require("/built/src/tokeniser");

const compileButton = document.getElementById("compile") as HTMLButtonElement;
const interpretButton = document.getElementById("interpret") as HTMLButtonElement;
const codeArea = document.getElementById("code") as HTMLTextAreaElement;
const outputArea = document.getElementById("output") as HTMLTextAreaElement;
CodeMirror.defineSimpleMode("simplemode", {
  start: [
    {
      regex: new RegExp(`(${keywords.join("|")})`),
      token: "keyword"
    },
    {
      regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
      token: "number"
    },
    { regex: /[-+\/*=<>!]+/, token: "operator" },
    { regex: /[a-z$][\w$]*/, token: "variable" }
  ]
});
const editor = CodeMirror.fromTextArea(codeArea, {
  mode: "simplemode",
  theme: "abcdef",
  lineNumbers: true
});
const sleep = async (ms: number) =>
  await new Promise(resolve => setTimeout(resolve, ms));
let marker: any;
const logMessage = (message: string | number) =>
  (outputArea.value = outputArea.value + message + "\n");
const markError = (token: Token|any) => {
  marker = editor.markText(
    { line: token.line, ch: token.char  },
    { line: token.line, ch: token.char  + token.value.length },
    { className: "error" }
  );
};
const run = async (runtime: Runtime) => {
  if (marker) {
    marker.clear();
  }
  await sleep(10);
  let tickFunction: TickFunction;
  try {
    tickFunction = await runtime(editor.getValue(), {
      print: logMessage
    });
    outputArea.value = "";
    logMessage(`Executing ... `);
    tickFunction();
    interpretButton.classList.remove("active");
  } catch (error: any) {
    logMessage(error.message);
    markError(error.token);
  }
};
interpretButton.addEventListener("click", async () => {
  interpretButton.classList.add("active");
  compileButton.classList.remove("active");
  await run(interpreterRuntime);
});
compileButton.addEventListener("click", async () => {
  compileButton.classList.add("active");
  interpretButton.classList.remove("active");
  await run(compilerRuntime);
});