export const keywords = ["print"];
export const operators = ["+", "-",  "/",  "*",  "==",  ">",  "<",  "&&"];

//The purpose of this function is to escape special regex characters in a string.
// want to use a string as a literal pattern in a regular expression, 
//ensuring that special characters are treated as literal characters rather than having their special regex meanings.
//ex: "Hello (world)" => "Hello \\(world\\)" escaping the parentheses so they would be treated as literal characters in a regex pattern.
const escapeRegEx = (text: string) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");


export class TokeniserError extends Error{
    index: number;
    constructor(message: string, index: number){
        super(message);
        this.index=index;
    }
}
const regexMatcher=(regex: string, type: tokenType): Matcher=>(input: string, index: number)=>{
    const match = input.substring(index).match(regex);
    return (
        match && {
          type,
          value: match[0]
        }
    );
}
//matches by the order priority
const matchers= [
    regexMatcher("^[0-9]+", "number"),
    regexMatcher(`^(${keywords.join("|")})`, "keyword"),
    regexMatcher("^\\s+", "whitespace"),
    regexMatcher(`^(${operators.map(escapeRegEx).join("|")})`, "operator"),
    regexMatcher("^[()]{1}", "parenthesis"),
];
const locationForIndex = (input:string, index: number) => ({
    char: index-input.lastIndexOf("\n",index) -1,
    line: input.substring(0,index).split("\n").length-1
});
export const tokenize: Tokieniser = (input: string) => {
    const tokens: Token[] = [];
    let index = 0;
    while(index<input.length){
        const matches = matchers.map(m=>m(input,index)).filter(f=>f);
        if(matches.length>0){
            const match = matches[0];
            if(match && match.type !== "whitespace"){
                tokens.push({...match, ...locationForIndex(input, index)});
            }
            index+=Number(match?.value.length); // it keeps getting me and error of the value may be null it is making me crazy 
        }
        else{
            throw new TokeniserError(`Unexpected token ${input.substring(index,index+1)}`, index);
        }
    }
    return tokens;
};




