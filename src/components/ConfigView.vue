
<template>
<div v-if="node != null">
    <div v-for="property in Object.entries(node)" :key="property[0]">
        <a-row justify="space-between" class="prop-row" type="flex">
            <a-col col="5">{{property[0]}}  </a-col>
            <a-col col="3" style="background-color : none"> : </a-col>
            <a-col col="12">
                <span v-if="typeof property[1] == typeof true">
                    <input type="checkbox" v-model="node[property[0]]" v-on:change="onchange">
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
            </a-col>
        </a-row>
    </div>
</div>
    <a-row>
       
    </a-row>
</template>

<script lang="ts">
import NodeModel from '@/models/node';
import { defineComponent , reactive, toRefs} from '@vue/runtime-core'
import { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
import {store} from '../store/DataStoreage'

export default defineComponent({
    name : "ConfigView",
    props : ["nodeid", "save"],
    setup(props) {
        const state = reactive({
            node : new NodeModel()
        })

        // copy our model to store node model
        state.node = {
            ...store.getNode(props.nodeid)!
        }

        function onchange(ev : ChangeEvent){
            console.log(state.node);
            console.log(store.state.nodes[0]);
        }

        function updateNode(){
            store.updateNode(state.node as NodeModel);
        }

    

        return {
            ...toRefs(props),
            ...toRefs(state),
            onchange,
            updateNode

        }
    },
})
</script>

<style scoped>
.prop-row{
    padding: 5px 10px 5px 10px;
}
</style>
