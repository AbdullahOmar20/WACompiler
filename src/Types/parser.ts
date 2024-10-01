type statementNode = printStatementNode | variableDeclarationNode;
type program = statementNode[];
type operator = "+" | "-" | "/" | "*" | "==" | ">" | "<" | "&&";
type expressionNode = numberLiteralNode | binaryExpressionNode | IndentifierNode;

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

interface printStatementNode extends programNode{
    type: "printStatement";
    expression: expressionNode
}

interface variableDeclarationNode extends programNode{
    type: "variableDeclaration";
    name: string;
    initializer: expressionNode
}

interface Parser{
(token: Token[]):program
}

interface parseStep<T extends programNode>{
    (): T
}