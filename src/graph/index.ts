type GraphId = string | number;

export default class Graph {
  constructor() {
    this.vertices = new Map();
  }

  private vertices: Map<GraphId, GraphId[]>;

  public addVertex(id: GraphId) {
    this.vertices.set(id, []);
  }

  public addEdge(target: GraphId, source: GraphId, bothway = false) {
    const targetMap = this.vertices.get(target);
    if (!targetMap.includes(source)) targetMap.push(source);
    if (bothway) {
      const sourceMap = this.vertices.get(source);
      if (!sourceMap.includes(target)) sourceMap.push(target);
    }
  }
}
