//using depth-first search it traverse over AST and apply visitor function on each leaf node

const traverse: traverse = (nodes, visitor) => {
    nodes = Array.isArray(nodes) ? nodes : [nodes];
    nodes.forEach(node => {
      Object.keys(node).forEach((prop: keyof programNode) => {
        const value = node[prop];
        const valueAsArray: string[] = Array.isArray(value) ? value : [value];
        valueAsArray.forEach((childNode: any) => {
          if (typeof childNode.type === "string") {
            traverse(childNode, visitor);
          }
        });
      });
      visitor(node);
    });
  };
  export default traverse;