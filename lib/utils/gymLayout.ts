import { type GymNode } from "@/data/godotGym";
import type { Edge } from "reactflow";

export interface NodePosition {
  x: number;
  y: number;
}

const TIER_COLUMN_WIDTH = 300;
const NODE_HEIGHT = 80;
const NODE_SPACING = 10;
const CATEGORY_GAP = 40;
const TIER_START_X = 100;
const TIER_START_Y = 100;

/**
 * Compute deterministic tier-column layout positions for all nodes
 * X-axis: 5 tier columns (Tier 1-5, left to right)
 * Y-axis: Group by category within each tier
 */
export function computeLayoutPositions(nodes: GymNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();

  // Group nodes by tier
  const nodesByTier = new Map<number, GymNode[]>();
  for (const node of nodes) {
    if (!nodesByTier.has(node.tier)) {
      nodesByTier.set(node.tier, []);
    }
    nodesByTier.get(node.tier)!.push(node);
  }

  // Process each tier
  for (let tier = 1; tier <= 5; tier++) {
    const tierNodes = nodesByTier.get(tier) || [];
    if (tierNodes.length === 0) continue;

    const x = (tier - 1) * TIER_COLUMN_WIDTH + TIER_START_X;

    // Group nodes by category within this tier
    const nodesByCategory = new Map<string, GymNode[]>();
    for (const node of tierNodes) {
      if (!nodesByCategory.has(node.category)) {
        nodesByCategory.set(node.category, []);
      }
      nodesByCategory.get(node.category)!.push(node);
    }

    let y = TIER_START_Y;

    // Process each category group
    const categories = Array.from(nodesByCategory.keys()).sort();
    for (const category of categories) {
      const categoryNodes = nodesByCategory.get(category)!;

      // Position each node in this category
      for (const node of categoryNodes) {
        positions.set(node.id, { x, y });
        y += NODE_HEIGHT + NODE_SPACING;
      }

      // Add gap after category group
      y += CATEGORY_GAP;
    }
  }

  return positions;
}

/**
 * Derive edges from prereqIds
 * Creates an edge from each prerequisite to the node that requires it
 */
export function computeEdges(nodes: GymNode[]): Edge[] {
  const edges: Edge[] = [];

  for (const node of nodes) {
    for (const prereqId of node.prereqIds) {
      // Verify prerequisite exists
      const prereqExists = nodes.some((n) => n.id === prereqId);
      if (prereqExists) {
        edges.push({
          id: `${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          type: "smoothstep",
        });
      }
    }
  }

  return edges;
}

/**
 * Find all edges in the prerequisite chain for a selected node
 * Returns a Set of edge IDs that should be highlighted
 */
export function computeHighlightedPrereqChain(selectedId: string, edges: Edge[]): Set<string> {
  const highlighted = new Set<string>();
  const visited = new Set<string>();

  // Build a reverse map: target -> sources
  const incomingEdges = new Map<string, string[]>();
  for (const edge of edges) {
    if (!incomingEdges.has(edge.target)) {
      incomingEdges.set(edge.target, []);
    }
    incomingEdges.get(edge.target)!.push(edge.source);
  }

  // Recursively find all prerequisites
  function findPrereqs(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const prereqs = incomingEdges.get(nodeId) || [];
    for (const prereqId of prereqs) {
      const edgeId = `${prereqId}-${nodeId}`;
      highlighted.add(edgeId);
      findPrereqs(prereqId);
    }
  }

  findPrereqs(selectedId);
  return highlighted;
}
