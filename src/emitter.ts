import { encode } from "punycode";
import { unsignedLEB128, encodeString, ieee754 } from "./encoding";
import traverse from "./traverse";

const flatten = (arr: any[]) => [].concat.apply([], arr);

// https://webassembly.github.io/spec/core/binary/modules.html#sections
enum Section {
  custom = 0,
  type = 1,
  import = 2,
  func = 3,
  table = 4,
  memory = 5,
  global = 6,
  export = 7,
  start = 8,
  element = 9,
  code = 10,
  data = 11
}

// https://webassembly.github.io/spec/core/binary/types.html
enum Valtype {
  i32 = 0x7f,
  f32 = 0x7d,
  f64 = 0x7c
}
enum Opcodes {
    end = 0x0b,
    call = 0x10,
    get_local = 0x20,
    set_local = 0x21,
    f32_const = 0x43,
    f64_const = 0x44,
    f32_eq = 0x5b,
    f64_eq = 0x61,
    f32_lt = 0x5d,
    f64_lt = 0x63,
    f32_gt = 0x5e,
    f64_gt = 0x64,
    i32_and = 0x71,
    f32_add = 0x92,
    f64_add = 0xa0,
    f32_sub = 0x93,
    f64_sub = 0xa1,
    f32_mul = 0x94,
    f64_mul = 0xa2,
    f32_div = 0x95,
    f64_div = 0xa3
};
const binaryOpcode = {
    "+": Opcodes.f64_add,
    "-": Opcodes.f64_sub,
    "*": Opcodes.f64_mul,
    "/": Opcodes.f64_div,
    "==": Opcodes.f64_eq,
    ">": Opcodes.f64_gt,
    "<": Opcodes.f64_lt,
    "&&": Opcodes.i32_and
  };
  // http://webassembly.github.io/spec/core/binary/modules.html#export-section
  enum ExportType {
    func = 0x00,
    table = 0x01,
    mem = 0x02,
    global = 0x03
  }
  
  // http://webassembly.github.io/spec/core/binary/types.html#function-types
  const functionType = 0x60;
  
  const emptyArray = 0x0;
  
  // https://webassembly.github.io/spec/core/binary/modules.html#binary-module
  const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
  const moduleVersion = [0x01, 0x00, 0x00, 0x00];
  
  // https://webassembly.github.io/spec/core/binary/conventions.html#binary-vec
  // Vectors are encoded with their length followed by their element sequence
  const encodeVector = (data: any[]) => [
    unsignedLEB128(data.length),
    ...flatten(data)
  ];
  const encodeLocal = (count: number, type: Valtype) => [
    unsignedLEB128(count),
    type
  ];
  
  // https://webassembly.github.io/spec/core/binary/modules.html#sections
  // sections are encoded by their type followed by content length and the actual content
  const createSection = (sectionType: Section, data: any[]) => [
    sectionType,
    ...encodeVector(data)
  ];

  //The variables in our AST are referenced via their identifier name
  //but WASM identifies local variables by their index
  //this function maps an identifier name to its index 
  const identifiersIndeces = new Map<string, number>();
  const identifierIndex = (name: string)=>{
    if(!identifiersIndeces.has(name)){
        identifiersIndeces.set(name, identifiersIndeces.size);
    }
    return identifiersIndeces.get(name);
  }

//this function emmit the WA code of AST nodes
const astCode = (ast: program) =>{
    const code: number[] = [];
    const emmitExpression = (expression: expressionNode)=>{
        traverse(expression, (node: expressionNode)=>{
            switch (node.type){
                case "numberliteral":
                    const tempNumberNode = node as numberLiteralNode;
                    code.push(Opcodes.f64_const);
                    code.push(...ieee754(tempNumberNode.value));
                    break;
                case "binaryExpression":
                    const tempBinaryNode = node as binaryExpressionNode;
                    code.push(binaryOpcode[tempBinaryNode.operator]);
                    break;
                case "identifier":
                    code.push(Opcodes.get_local);
                    code.push(...unsignedLEB128(identifierIndex(node.value)));
                    break;
            }

        });
    };
    ast.forEach(statement =>{
        switch(statement.type){
            case "printStatement":
                emmitExpression(statement.expression);
                code.push(Opcodes.call);
                code.push(...unsignedLEB128(0));
                break;
            case "variableDeclaration":
              emmitExpression(statement.initializer);
              code.push(Opcodes.set_local);
              code.push(...unsignedLEB128(identifierIndex(statement.name)));
              break;
        }
    });
    return {code, identifiersCount: identifiersIndeces.size};
};

export const emitter: Emitter = (ast: program) => {
    // Function types are vectors of parameters and return types. Currently
    // WebAssembly only supports single return values
    const voidVoidType = [functionType, emptyArray, emptyArray];
  
    const floatVoidType = [
      functionType,
      ...encodeVector([Valtype.f64]),
      emptyArray
    ];
  
    // the type section is a vector of function types
    const typeSection = createSection(
      Section.type,
      encodeVector([voidVoidType, floatVoidType])
    );
  
    // the function section is a vector of type indices that indicate the type of each function
    // in the code section
    const funcSection = createSection(
      Section.func,
      encodeVector([0x00 /* type index */])
    );
  
    // the import section is a vector of imported functions
    const printFunctionImport = [
      ...encodeString("env"),
      ...encodeString("print"),
      ExportType.func,
      0x01 // type index
    ];
  
    const importSection = createSection(
      Section.import,
      encodeVector([printFunctionImport])
    );
  
    // the export section is a vector of exported functions
    const exportSection = createSection(
      Section.export,
      encodeVector([
        [...encodeString("run"), ExportType.func, 0x01 /* function index */]
      ])
    );
    const {code, identifiersCount} = astCode(ast);
    const identifier = identifiersCount > 0 ? [encodeLocal(identifiersCount, Valtype.f64)] : [];
  
    // the code section contains vectors of functions
    const functionBody = encodeVector([
      ...encodeVector(identifier),
      ...code,  
      Opcodes.end
    ]);
  
    const codeSection = createSection(Section.code, encodeVector([functionBody]));
  
    return Uint8Array.from([
      ...magicModuleHeader,
      ...moduleVersion,
      ...typeSection,
      ...importSection,
      ...funcSection,
      ...exportSection,
      ...codeSection
    ]);
  };