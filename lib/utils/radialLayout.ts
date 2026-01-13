import { gymNodes, type GymNode } from "@/data/godotGym";

export interface NodePosition {
  node: GymNode;
  x: number;
  y: number;
  angle: number;
  radius: number;
}

export interface RadialLayout {
  centerX: number;
  centerY: number;
  nodePositions: NodePosition[];
  ringRadii: number[];
}

/**
 * Calculate radial layout for all nodes
 * Nodes are organized by tier (rings) and category (clusters within rings)
 */
export function calculateRadialLayout(
  containerWidth: number,
  containerHeight: number,
  padding: number = 100
): RadialLayout {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const maxRadius = Math.min(containerWidth, containerHeight) / 2 - padding;

  // Calculate ring radii (5 tiers)
  const ringRadii: number[] = [];
  for (let tier = 1; tier <= 5; tier++) {
    // Distribute rings evenly, with center hub at 0
    const radius = (maxRadius / 5) * tier;
    ringRadii.push(radius);
  }

  // Group nodes by tier and category
  const nodesByTier = new Map<number, Map<string, GymNode[]>>();
  for (const node of gymNodes) {
    if (!nodesByTier.has(node.tier)) {
      nodesByTier.set(node.tier, new Map());
    }
    const tierMap = nodesByTier.get(node.tier)!;
    if (!tierMap.has(node.category)) {
      tierMap.set(node.category, []);
    }
    tierMap.get(node.category)!.push(node);
  }

  const nodePositions: NodePosition[] = [];

  // Process each tier
  for (let tier = 1; tier <= 5; tier++) {
    const tierMap = nodesByTier.get(tier);
    if (!tierMap) continue;

    const radius = ringRadii[tier - 1];
    const categories = Array.from(tierMap.keys());
    const totalNodes = Array.from(tierMap.values()).reduce((sum, nodes) => sum + nodes.length, 0);

    // Allocate angle ranges per category
    // Each category gets a proportional arc based on number of nodes
    let currentAngle = 0;
    const categoryRanges: Array<{ category: string; startAngle: number; endAngle: number; nodes: GymNode[] }> = [];

    for (const category of categories) {
      const nodes = tierMap.get(category)!;
      const nodeCount = nodes.length;
      const angleRange = (nodeCount / totalNodes) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleRange;
      categoryRanges.push({ category, startAngle, endAngle, nodes });
      currentAngle = endAngle;
    }

    // Distribute nodes within each category's arc
    for (const { startAngle, endAngle, nodes } of categoryRanges) {
      const nodeCount = nodes.length;
      const angleStep = (endAngle - startAngle) / (nodeCount + 1);

      nodes.forEach((node, index) => {
        // Angle in degrees, convert to radians
        const angleDeg = startAngle + angleStep * (index + 1);
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);

        nodePositions.push({
          node,
          x,
          y,
          angle: angleRad,
          radius,
        });
      });
    }
  }

  return {
    centerX,
    centerY,
    nodePositions,
    ringRadii,
  };
}

/**
 * Get all nodes in the same category (for intra-cluster connections)
 */
export function getNodesInCategory(category: string, tier: number): GymNode[] {
  return gymNodes.filter((node) => node.category === category && node.tier === tier);
}

/**
 * Calculate curved path between two nodes
 * Returns SVG path string for a quadratic bezier curve
 */
export function getCurvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number = 0.3
): string {
  // Calculate perpendicular offset for curve
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // If nodes are at the same position, return a straight line
  if (distance < 0.1) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offset = distance * curvature;

  // Perpendicular vector
  const perpX = -dy / distance;
  const perpY = dx / distance;

  const controlX = midX + perpX * offset;
  const controlY = midY + perpY * offset;

  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
}
