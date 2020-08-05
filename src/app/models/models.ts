export interface Scenarios {
  edges: Array<Edge>;
  nodes: Array<Node>;
}

export interface Edge {
  data: EdgeData;
}

export interface EdgeData {
  source: string;
  target: string;
  type: EdgeType;
}

export interface Node {
  data: NodeData;
}

export interface NodeData {
  id: string;
  name: string;
  nodes: string;
  pages: Array<number>;
  status: Status;
  treasure: { [key: string]: TreasureDetail };
}

export interface TreasureDetail {
  description: string;
  looted: 'true' | 'false';
}

export type EdgeType = 'linksto' | 'blocks' | 'unlocks' | 'requiredby';
export type Status = 'complete' | 'hidden' | 'incomplete' | 'locked';
