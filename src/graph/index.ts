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
    const targetMap = this.vertices.get(target) || [];
    if (!targetMap.includes(source)) targetMap.push(source);
    if (bothway) {
      const sourceMap = this.vertices.get(source) || [];
      if (!sourceMap.includes(target)) sourceMap.push(target);
    }
  }

  public path(target: GraphId, source: GraphId) {
    const distances: Record<GraphId, number> = {};
    const previous: Record<GraphId, GraphId | null> = {};
    const queue: GraphId[] = [];
    const visited: Record<GraphId, boolean | null> = {};
    this.vertices.forEach((_val, key) => {
      distances[key] = Infinity;
      previous[key] = null;
      queue.push(key);
    });
    distances[target] = 0;
    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const closest = queue.shift();
      if (!closest || visited[closest]) continue;
      visited[closest] = true;
      const neighbors = this.vertices.get(closest);
      for (const neighbor in neighbors) {
        if (neighbors.includes(neighbor)) {
          const distanceToClosest = distances[closest];
          if (distanceToClosest + 1 < distances[neighbor]) {
            distances[neighbor] = distanceToClosest + 1;
            previous[neighbor] = closest;
          }
        }
      }
    }
    const path:GraphId[] = [];
    let shortestPathEnd = source;
    while (previous[shortestPathEnd]) {
      path.push(shortestPathEnd);
      shortestPathEnd = previous[shortestPathEnd] as any;
    }
    path.push(target);
    path.reverse();

    return {
      distance: distances[source],
      path: path,
    };
  }
}
