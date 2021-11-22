<template>
  <div v-if="!graphLoaded" >
      <a-row align="middle" class="page">
          <a-col span="6"></a-col>
          <a-col span="12">
              <a-card :loading="loading" title="graphs">
                  <div v-if="graphs.length > 0">
                      <div v-for="(graph, index) in graphs" :key="graph.id" class="graph-btn" @click="loadupGraphToBomBoClaat(index)">
                          {{graph.name}}
                      </div>
                  </div>
              </a-card>
          </a-col>
          <a-col span="6"></a-col>
      </a-row>
  </div>
  <div v-else>
      <App />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/runtime-core";
import { reactive, toRefs } from "vue";
import App from '@/App.vue'
import {apiStore} from '@/api/api'

export default defineComponent ({
    name : "Welcome",
    components : {
        App,
    },


    setup(){

        const state = reactive({
            graphLoaded : false,
            loading : true,
            graphs : [] as any[]
        })

        onMounted(async ()=> {
            const ans = await apiStore.getGraph();
            if(ans){
                state.loading = false;
                state.graphs = apiStore.state.graphs;
            }
        })

        function loadupGraphToBomBoClaat(idx : number){
            const ans = apiStore.setCurrentGraph(idx)
            state.graphLoaded = true;
        }
    
    
        return {
            ...toRefs(state),
            loadupGraphToBomBoClaat
        }


    }

})
</script>

<style>

.page{
    height : 100vh;
}

.graph-btn{
    padding: 10px;
    margin: 10px;
    border: 2px solid rgba(240, 240, 240, 1);
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 0px 10px rgba(250, 250, 250, .2);
    transition: .3s;
}

.graph-btn:hover{
    /* transform: scale(1.1); */
    box-shadow: 0px 0px 30px rgba(250, 250, 250, .4);
    border: 2px solid rgba(140, 140, 240, 1);

      /* padding: 13px; */
}
</style>