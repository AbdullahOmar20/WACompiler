
# WASM Compiler — A Simple Programming Language Targeting WebAssembly

A lightweight programming language that compiles to WebAssembly (WASM), built entirely in TypeScript.
This project demonstrates the fundamental concepts of compiler design — from lexical analysis to code generation — in a simple and educational way.



## 🚀 Features

📝 Custom Language Syntax

- Declare variables using simple syntax.

- Perform basic arithmetic operations (+, -, *, /).

- Print values to the console.

⚙️ Compiler Pipeline

- Lexer — Tokenizes the source code.

- Parser — Builds an Abstract Syntax Tree (AST).

- Code Generator — Converts the AST to WebAssembly (WAT / binary).

🧠 Educational & Minimal

- Designed for learning compiler intern

- Clear modular TypeScript structure.

- Tested with Jest for consistent and reliable behavior.


## 🧩 Example

```Plaintext
var x = 10
var y = 5
var z = x + y * 2
print z
```



## 🛠️ Project Structure

```
wasm-compiler/
│
├── src/
│   ├── compiler.ts         
│   ├── interpreter.ts      
│   ├── tokenizer.ts        
│   ├── parser.ts          
│   ├── emitter.ts          
│   ├── index.ts          
│   ├── index.html          
│   ├── Types/            
│   └── encoding.ts           
│
├── tests/                # Unit tests implemented using Jest
│   ├── compiler.test.ts
│   ├── interpreter.test.ts
│   ├── parser.test.ts
│   ├── tokenizer.test.ts
│   └── testCases.test.ts
│
│
├── dist/                 # Compiled JavaScript output
│
├── package.json
└── README.md

```
## 🔮 Future Enhancements

- Add control flow (if/else, loops)
- Add functions and parameters
- Implement type checking
- Build a web-based playground
## 🧑‍💻 Author

Abdullah Omar

[github](https://github.com/AbdullahOmar20) [LinkedIn](www.linkedin.com/in/abdullah-omar-amer)

