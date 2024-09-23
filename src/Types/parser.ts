type statementNode = printStatementNode;
type program = statementNode[];
type operator = "+" | "-" | "/" | "*" | "==" | ">" | "<" | "&&";
interface programNode{
    type: string
}

interface numberLiteralNode extends programNode{
    type: "numberliteral";
    value: number
}

interface binaryExpressionNode extends programNode{
    type: "binaryExpression";
    left: expressionNode
    right: expressionNode
    operator: operator
}

interface IndentifierNode extends programNode{
    type: "identifier";
    value: string
}

type expressionNode = numberLiteralNode | binaryExpressionNode;
interface printStatementNode extends programNode{
    type: "printStatement";
    expression: expressionNode
}

interface Parser{
(token: Token[]):program
}

interface parseStep<T extends programNode>{
    (): T
}