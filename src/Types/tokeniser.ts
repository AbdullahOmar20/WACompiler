type tokenType = "number"| "string" | "parenthesis" | "operator" | "keyword" | "whitespace" | "identifier" | "assignment" ;
interface Tokieniser{
    (input: string): Token[];
}
interface Token{
    type: tokenType,
    value: string,
    line?: number,
    char?: number
}
interface Matcher{
    (input: string, index:number): Token | null;
}