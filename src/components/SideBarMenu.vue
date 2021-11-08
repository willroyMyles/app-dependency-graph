<template>
  <transition name="mounted">
    <a-layout style="background-color : white">
      <!-- <a-layout-content style="height: 90vh; display : flex"> -->
        <div class="mounted content">
          <a-row justify="space-between">
            <a-col >fliter by tag : </a-col>
            <a-col >
              <a-select style="width: 100px" mode="multiple" placeholder="tags" :value="currentTags" @change="handleTagChange">
                <a-select-option
                  v-for="tag in tags"
                  :key="tag"
                  :value="tag"
                  >{{ tag }}</a-select-option
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

export default defineComponent({
  name: "SideBarMenu",

  setup() {
    const state = reactive({
      currentTags: Array.from(store.state.filter.tags) as string[],
      tags : store.getTags() as string[]
    });

    function filterByTag() {
      //d3store to filter by tag
      store.filterByTag(state.currentTags)
    }

    function handleTagChange(tag : string[]){
      state.currentTags = tag
    }

    return {
      ...toRefs(state),
      store,
      filterByTag,
      handleTagChange
    };
  },
});
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
