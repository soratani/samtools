import { Graph } from "..";
describe("图结构测试", () => {
  it("两点最短路径", () => {
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
    const a = graph.path(1, 9);
    console.log(a);
  });
});
