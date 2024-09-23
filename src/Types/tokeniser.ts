interface Tokieniser{
    (input: string): Token[];
}
interface Token{
    type: tokenType,
    value: string,
    line?: number,
    char?: number
}
type tokenType = "number"| "string" | "parenthesis" | "operator" | "keyword" | "whitespace" ;
interface Matcher{
    (input: string, index:number): Token | null;
}