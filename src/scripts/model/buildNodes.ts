import GraphNode from "./GraphNode";

export default function buildNodes(events) {
  return events.map((event, index) => {
    return new GraphNode({ event, index });
  });
}
