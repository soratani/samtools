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

  public path(target: GraphId, source: GraphId) {
    const distances: Record<GraphId, number> = {};
    const previous: Record<GraphId, GraphId> = {};
    const queue: GraphId[] = [];
    const visited: Record<GraphId, boolean> = {};
    this.vertices.forEach((_val, key) => {
      distances[key] = Infinity;
      previous[key] = null;
      queue.push(key);
    });
    distances[target] = 0;
    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const closest = queue.shift();
      if (visited[closest]) continue;
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
    const path = [];
    let shortestPathEnd = source;
    while (previous[shortestPathEnd]) {
      path.push(shortestPathEnd);
      shortestPathEnd = previous[shortestPathEnd];
    }
    path.push(target);
    path.reverse();

    return {
      distance: distances[source],
      path: path,
    };
  }
}

const graph = new Graph();
graph.addVertex(1);
graph.addVertex(2);
graph.addVertex(3);
graph.addVertex(4);
graph.addVertex(5);
graph.addVertex(6);
graph.addVertex(7);
graph.addVertex(8);
graph.addVertex(9);
graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 4);
graph.addEdge(2, 3);
graph.addEdge(3, 7);
graph.addEdge(4, 7);
graph.addEdge(7, 9);
graph.addEdge(2, 9);
const a = graph.path(2, 9);
console.log(a);
