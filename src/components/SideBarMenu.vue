<template>
  <transition name="mounted">
    <a-layout style="background-color : white">
      <!-- <a-layout-content style="height: 90vh; display : flex"> -->
        <div class="mounted content">
          <a-row justify="space-between">
            <a-col span="9">fliter by tag : </a-col>
            <a-col span="" >
              <a-select style="width: 100px" mode="multiple" placeholder="tags" :value="currentTags" @change="handleTagChange" >
                <a-select-option
                  v-for="tag in tagoptions"
                  :key="tag"
                  :value="tag"
                  >{{ tag }}</a-select-option
                >
              </a-select>
            </a-col>
          </a-row>
          <a-row justify="space-between">
            <a-col span ="9"> search </a-col>
            <a-col >
              <a-select ref="searchRef" style="width: 100px" mode="multiple" placeholder="search" :value="pattern" @search="searchByName" @change="handleSearchChange" >
                <a-select-option
                  v-for="node in searchResults"
                  :key="node.id"
                  :value="node.name"
                  >{{ node.name }}</a-select-option
                >
              </a-select>
            </a-col>
          </a-row>
        </div>
      <!-- </a-layout-content> -->
        <a-row style="bottom" justify="center">
          <a-col col="12">
            <a-button type="primary" @click="filterByTag"> Commit </a-button>
          </a-col>
        </a-row>
    </a-layout>
  </transition>
</template>

<script lang="ts">
import {
  Component,
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { store } from "@/store/DataStoreage";
import NodeModel from "@/models/node";
import debounce from 'debounce-fn'
import { Timer } from "d3";
import debounceFn from "debounce-fn";


export default defineComponent({
  name: "SideBarMenu",

  setup() {
    const state = reactive({
      currentTags: [] as string[],
      tagoptions : [] as string[],
      pattern : [] as string[],
      searchResults : [] as NodeModel[]
    });

    const debounceFunction = debounce((arg : string) => {
        state.searchResults = store.searchByName(arg)
        if(arg == "") state.searchResults = []
      }, {wait : 2000})

    const searchRef = ref();

    onMounted(()=>{
      state.currentTags = Array.from(store.state.filter.tags)
      state.tagoptions = store.getTags()
    })

    function filterByTag() {
      console.log(state.currentTags);
      
      store.filterByTag(state.currentTags)
    }

    function handleTagChange(tag : string[]){
      console.log(tag);
      
      state.currentTags = tag
    }

    function handleSearchChange(pattern : string[]){
      searchRef.value.blur()
      console.log(pattern);
      // should highlight node
      
    }

    function searchByName(pattern : string){
      //should debounce and then search
      debounceFunction(pattern as any)
    }

    return {
      ...toRefs(state),
      store,
      filterByTag,
      searchByName,
      handleTagChange,
      handleSearchChange,
      searchRef
      
    };
  },
});

function timer(arg0: (elasped: any) => void): Timer | null {
throw new Error("Function not implemented.");
}
</script>

<style scoped>
.mounted {
  opacity: 1;
  padding: 1em;
  transition: 3s;
}

.mounted::enter {
  opacity: 1;
}

.mounted::leave {
  opacity: 0;
}

.content {
    height: 90vh;
}

.bottom {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  bordertop: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  textalign: right;
  zindex: 1;
}
</style>
