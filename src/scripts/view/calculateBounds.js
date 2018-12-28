export default function calculateBounds(node) {
  return {
    halfX: node.x + node.halfWidth,
    halfY: node.adjustedY + node.halfHeight,
    x1: node.x,
    x2: node.x + node.width,
    y1: node.adjustedY,
    y2: node.adjustedY + node.height,
  };
}
