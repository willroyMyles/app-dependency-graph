
<template>
<div v-if="node != null">
    <div v-for="property in Object.entries(node)" :key="property[0]">
        <a-row justify="space-between" class="prop-row" type="flex">
            <a-col col="5">{{property[0]}}  </a-col>
            <a-col col="3" style="background-color : none"> : </a-col>
            <a-col col="12">
                <span v-if="typeof property[1] == typeof true" >
                    <input type="checkbox" v-model="node[property[0]]" >
                </span>
                <span v-if="typeof property[1] == typeof ''">
                    <input type="text" v-model="node[property[0]]">
                </span>
                <span v-if="typeof property[1] == typeof 10">
                    <input type="number" v-model="node[property[0]]">
                </span>
                <span v-if=" property[1] == null">
                    none
                </span>
                <span v-if=" property[1] instanceof Array">
                    array
                </span>
                <span v-if=" property[1] instanceof subenum">
                    <select v-model="node[property[0]]"  >
                            <option v-for="val in Object.values(nodetype)" :key="val.value" :value="val"  >{{val.value}}</option>
                    </select>
                </span>
            </a-col>
        </a-row>
    </div>
</div>
    <a-row>
       
    </a-row>
</template>

<script lang="ts">
import NodeType, { SubEnum } from '@/enums/NodeEnum';
import NodeModel from '@/models/node';
import { defineComponent , onUpdated, reactive, toRefs} from '@vue/runtime-core'
import { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
import {store} from '../store/DataStoreage'

export default defineComponent({
    name : "ConfigView",
    props : ["nodeid", "save"],
    
    setup(props) {
        const state = reactive({
            node : new NodeModel(),
            subenum : SubEnum,
            nodetype : NodeType
        })
        
        // copy our model to store node model
        state.node = {
            ...store.getNode(props.nodeid)!
        }

        function updateNode(){
             store.updateNode(state.node as NodeModel);
        }

        function updateType(val : any){
            console.log(val)
            state.node.type = NodeType.valueOf(val)!
            console.log(state.node.type)
        }

        onUpdated(()=>{
            state.node = {
            ...store.getNode(props.nodeid)!
        }
        })
    

        return {
            ...toRefs(props),
            ...toRefs(state),
            onchange,
            updateNode,
            updateType

        }
    },

    
})
</script>

<style scoped>
.prop-row{
    padding: 5px 10px 5px 10px;
}
</style>
