import { unsignedLEB128, encodeString, ieee754 } from "./encoding";
import traverse from "./traverse";

const flatten = (arr: any[]): never[] => [].concat.apply([], arr);

enum sections{
    custom=0,
    type=1,
    import=2,
    function = 3,
    table = 4,
    memory = 5,
    global = 6,
    export = 7,
    start = 8,
    element = 9,
    code = 10,
    data = 11
};
enum types{
    i32 = 0x7F,
    f32 = 0x7D,
};
enum Opcodes {
    call = 0x10,
    end = 0x0b,
    get_local = 0x20,
    f32_const = 0x43,
    f32_eq = 0x5b,
    f32_lt = 0x5d,
    f32_gt = 0x5e,
    i32_and = 0x71,
    f32_add = 0x92,
    f32_sub = 0x93,
    f32_mul = 0x94,
    f32_div = 0x95
};
const binaryCode={
    "+": Opcodes.f32_add,
    "-": Opcodes.f32_sub,
    "*": Opcodes.f32_mul,
    "/": Opcodes.f32_div,
    "==": Opcodes.f32_eq,
    ">": Opcodes.f32_gt,
    "<": Opcodes.f32_lt,
    "&&": Opcodes.i32_and
};
enum ExportType {
    func = 0x00,
    table = 0x01,
    mem = 0x02,
    global = 0x03
};
const functionType = 0x60;
const emptyArray = 0x0;
const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];

const encodeVector = (data: any[])=>[
    unsignedLEB128(data.length),
    ...flatten(data)
];

const createSection= (sectiontype: sections, data: any[])=>[
    sectiontype,
    ...encodeVector(data)
];

//this function emmit the WA code of AST nodes
const astCode = (ast: program) =>{
    const code: number[] = [];
    const emmitExpression = (expression: expressionNode)=>{
        traverse(expression, (node: programNode)=>{
            switch (node.type){
                case "numberliteral":
                    const tempNumberNode = node as numberLiteralNode;
                    code.push(Opcodes.f32_const);
                    code.push(...ieee754(tempNumberNode.value));
                    break;
                case "binaryExpression":
                    const tempBinaryNode = node as binaryExpressionNode;
                    code.push(binaryCode[tempBinaryNode.operator]);
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
        }
    });
    return code;
};

export const emitter : Emitter= (ast: program) => {
    //void function with void params
    const voidVoidTypes = [functionType, emptyArray, emptyArray];
    //void function with float params
    const floatVoidTypes = [functionType,...encodeVector([types.f32]), emptyArray];

    
    const addFunctionType=[
        functionType,
        ...encodeVector([types.f32, types.f32]),
        ...encodeVector([types.f32])
    ];
    //the type section is vector of function types
    const typeSection : any[] = createSection(sections.type, encodeVector([voidVoidTypes, floatVoidTypes]));

    //the function section is vector of type indeces that indecates the type of each function in the section 
    const functionSection:any[] = createSection(sections.function, encodeVector([0x00]));

    const printFunctionImport = [
        ...encodeString("env"),
        ...encodeString("print"),
        ExportType.func,
        0x01 // type index
      ];
      const importSection = createSection(
        sections.import,
        encodeVector([printFunctionImport])
      );

    //the export section is vector of exported functions
    const exportSection :any[] = createSection(sections.export, encodeVector([
        [...encodeString("run"), ExportType.func, 0x01]
    ]));

    const code = [
        Opcodes.get_local,
        ...unsignedLEB128(0),
        Opcodes.get_local,
        ...unsignedLEB128(1),
        Opcodes.f32_add
    ];

    const functionBody = [
        emptyArray,//local variables
        ...astCode(ast),
        Opcodes.end
    ];

    const codeSection :any[] = createSection(sections.code, encodeVector([functionBody]));
    return Uint8Array.from([
        ...magicModuleHeader,
        ...moduleVersion,
        ...typeSection,
        ...importSection,
        ...functionSection,
        ...exportSection,
        ...codeSection
      ]);

    
}; 