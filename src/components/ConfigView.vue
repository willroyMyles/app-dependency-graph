
<template>
<div v-if="node != null">
    <div v-for="property in Object.entries(node)" :key="property[0] + node.id">
        <a-row justify="space-between" align="middle" class="prop-row" type="flex">
            <a-col span="4" >{{property[0]}}  </a-col>
            <a-col >
                <span v-if="typeof property[1] == typeof true" >
                    <input type="checkbox" v-model="node[property[0]]" :disabled="disabled" />
                </span>
                <span v-if="typeof property[1] == typeof ''">
                    <input type="text" v-model="node[property[0]]" :disabled="disabled" />
                </span>
                <span v-if="typeof property[1] == typeof 10">
                    <input type="number" v-model="node[property[0]]" :disabled="disabled" />
                </span>
                <span v-if=" property[1] == null">
                    none
                </span>
                <span v-if=" property[1] instanceof Array">
                    <div v-if="property[0] == 'connections'">
                    <a-select class="input-disabled" mode="multiple" style="width: 100px" v-on:change="handleConnections" placeholder="Tags Mode" :value="node[property[0]]" :disabled="disabled">
                        <a-select-option v-for="val in getNodesConnections()" :key="val.id" :value="val.id" >

                            {{val.name}}
                        </a-select-option>
                    </a-select>
                    </div>
                <div v-if="property[0] == 'tags'">
                    <a-select class="input-disabled" mode="tags" style="width: 100px" v-on:change="handleTags" placeholder="no tags..." :value="node[property[0]]" :disabled="disabled">
                        <a-select-option v-for="val in datastore.state.tags" :key="val" :value="val" >
                            {{val}}
                        </a-select-option>
                    </a-select>
                    </div>
                </span>
                <span v-if=" property[1] instanceof subenum">
                    <select class="input-disabled" v-model="node[property[0]]" :disabled="disabled" >
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
import ServiceModel from '@/models/ServiceModel';
import { defineComponent , onMounted, onUpdated, reactive, toRefs, watch} from '@vue/runtime-core'
import { message } from 'ant-design-vue';
import { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
import {store} from '../store/DataStoreage'

export default defineComponent({
    name : "ConfigView",
    props : ["nodeProp", "disabled"],
    
    setup(props, ctx) {
        const state = reactive({
            node : new NodeModel(),
            subenum : SubEnum,
            nodetype : NodeType,
            arr : ["arr"]
        })
        
        // copy our model to store node model


        onMounted(()=>{
        state.node = {
            ...props.nodeProp
        }
        })

        const updateNode = () =>{
           const n =  store.updateNode(state.node);
           state.node = new NodeModel()
           state.node = n
            message.info(`${n.name} node updated`, 2 )
           return true;
        }

        function updateType(val : any){
            state.node.type = NodeType.valueOf(val)!
        }

        function handleConnections(d:any){
            (state.node as ServiceModel).connections = d         
        }

        function getNodesConnections(){
            let conn = store.state.nodes.values();
            return Array.from(conn).filter(p => p.id != state.node.id)
        }

        function handleTags(d:string[]){
            state.node.tags = d      
        }

        function reset(){
            if(state.node){
                state.node = { 
                    ...store.getNode(state.node.id)!
                }
            }
        }

        return {
          //  ...toRefs(props),
            ...toRefs(state),
            onchange,
            updateNode,
            updateType,
            handleConnections,
            getNodesConnections,
            handleTags,
            datastore : store,
            reset

        }
    },

    
})
</script>

<style>
.prop-row{
    padding: 5px 10px 5px 10px;
    overflow: hidden;
}

hr {
    background-color: lightgrey;
    opacity: .1;
    height: 3px;
}

input, select, .ant-select{
    border: 1.2px solid lightgray;
    padding: 5px;
    border-radius: 3px;
}

input:disabled, select:disabled, .ant-select-disabled, .input-disabled:disabled, .ant-select-disabled, .ant-select-selector, .ant-select:disabled{
    border: none !important;
    background: transparent !important;
    color: black !important;

}


</style>
