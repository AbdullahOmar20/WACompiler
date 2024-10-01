import { tokenize } from "./tokeniser";
import { parse } from "./parser";


const applyOperator = (op: string, left: number, right: number) => {
    switch (op) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return left / right;
        case "==":
            return left == right ? 1 : 0;
        case ">":
            return left > right ? 1 : 0;
        case "<":
            return left < right ? 1 : 0;
        case "&&":
            return left && right;
        default:
            throw Error(`Unknown binary operator ${op}`);
  }
};


export const runtime: Runtime= async (src, {print}) => ()=>{
    const tokens = tokenize(src);
    const ast = parse(tokens);
    const identifires = new Map();
    const evaluateExpression = (expression: expressionNode): number =>{
        switch(expression.type){
            case "numberliteral":
                return expression.value;
            case "binaryExpression":
                return applyOperator(
                    expression.operator,
                    evaluateExpression(expression.left),
                    evaluateExpression(expression.right)
                );
            case "identifier":
                return identifires.get(expression.value);
            default:
                return 0;
        }
    }
    const excuteStatement = (statements: statementNode[]) =>{
        statements.forEach(statement =>{
            switch (statement.type){
                case "printStatement":
                    print(evaluateExpression(statement.expression));
                    break;
                case "variableDeclaration":
                    identifires.set(statement.name, evaluateExpression(statement.initializer));
                    break;
            }
        });
    }
    excuteStatement(ast); 
} 

