interface traverse{
    (nodes: programNode| programNode[], visitor: Visitor): void;
}
interface Visitor{
    (node: programNode): void;
}