import axios from 'axios';
import NodeModel from "../models/node";

const api = 'api';

class NodeService {
  deleteNode(node: NodeModel) {
    const nodes = axios.delete(`http://localhost:5000/${api}/node/${node.id}`);
    console.log("NODES SERVICE: " + nodes);
    return nodes;
  }
  getNodes() {
    return axios.get<NodeModel[]>(`http://localhost:5000/${api}/node`);
  }
  addNode(node: NodeModel) {
    return axios.post(`http://localhost:5000/${api}/node/`, { node });
  }
  updateNode(node: NodeModel) {
    return axios.put(`http://localhost:5000/${api}/node/${node.id}`, { node });
  }
}

// Export a singleton instance in the global namespace
export const nodeService = new NodeService();