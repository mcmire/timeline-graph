export default function calculateBounds(node) {
  return {
    x1: node.x,
    x2: node.x + node.width,
    halfX: node.x + (node.width / 2),
    y1: node.y,
    y2: node.y + node.height,
    halfY: node.y + (node.height / 2),
  };
}
