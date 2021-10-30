import NodeModel from "@/models/node";
import { InjectionKey } from "vue";
import { createStore, Store, useStore } from "vuex";
import * as d3 from "d3";
import { useThisStore } from "./d3Store";

interface State {
  nodes: NodeModel[];
}

export const key: InjectionKey<Store<State>> = Symbol();
export function useDataStore() {
  return useStore(key);
}

export default createStore<State>({
  state: {
    nodes: [
      new NodeModel("esif"),
      new NodeModel("web admin"),
      new NodeModel("Reward service"),
    ],
  },
  mutations: {
    initalize(ctx) {
      const d3store = useThisStore();

      const { width, height, radius } = d3store.state;

      d3.range(ctx.nodes.length).map((i) => {
        ctx.nodes[i].x = Math.random() * (width - radius * 2) + radius;
        ctx.nodes[i].y = Math.random() * (height - radius * 2) + radius;
      });

      ctx.nodes[1].downStream.push(ctx.nodes[2].id);
      ctx.nodes[0].downStream.push(ctx.nodes[2].id);
      ctx.nodes[1].downStream.push(ctx.nodes[0].id);
    },
  },
  actions: {},
  modules: {},
});
