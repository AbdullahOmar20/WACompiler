export class ParserError extends Error {
    index: number;
    constructor(message: string, index: number) {
        super(message);
        this.index = index;
    }
}
const asOperator = (value: string): operator => {
    return value as operator;
}

export const parse: Parser = tokens => {
    //iterating over tokens
    let tokenIterator = tokens[Symbol.iterator]();
    let currentToken = tokenIterator.next().value;

    const eatToken = (value?: string) => {
        if (value && value !== currentToken.value) {
            throw new ParserError(`expected token value ${value} received ${currentToken.value}`, currentToken);
        }
        currentToken = tokenIterator.next().value;

    }

    //parsing expressions
    const parseExpression: parseStep<expressionNode> = () => {
        let node: expressionNode;
        switch (currentToken.type) {
            case "number":
                node = {
                    type: "numberliteral",
                    value: Number(currentToken.value)
                };
                eatToken();
                return node;

            case "identifier":
                node = {
                    type : "identifier",
                    value: currentToken.value
                };
                eatToken();
                return node;

            case "parenthesis":
                eatToken("(");
                const left = parseExpression();
                const operator = currentToken.value;
                eatToken();
                const right = parseExpression();
                eatToken(")");
                return {
                    type: "binaryExpression",
                    left,
                    right,
                    operator: asOperator(operator)
                };

            default:
                throw new ParserError(`expected token type received ${currentToken.type}`, currentToken);
        }
    };

    //parsing variable declaration statement
    const parseVariableDeclaration: parseStep<variableDeclarationNode> = () => {
        eatToken("var");
        const name = currentToken.value;
        eatToken();
        eatToken("=");
        return {
            type: "variableDeclaration",
            name,
            initializer: parseExpression()
        };
    };

    //parsing print statement
    const parsePrint: parseStep<printStatementNode> = () => {
        eatToken("print");
        return {
            type: "printStatement",
            expression: parseExpression()
        }
    }


    //parsing statements
    const parseStatement: parseStep<statementNode | any> = () => {
        if (currentToken.type === "keyword") {
            switch (currentToken.value) {
                case "print":
                    return parsePrint();
                case "var":
                    return parseVariableDeclaration();
                default:
                    throw new ParserError(`unknown keyword ${currentToken.type}`, currentToken);
            }
        }
    };
    //goal to create an array of statements from tokens
    const nodes: statementNode[] = [];
    while (currentToken) {
        nodes.push(parseStatement());
    }
    return nodes
}