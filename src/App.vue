<template>
  <a-layout>
    <!-- <a-layout-header>header</a-layout-header> -->
    <a-layout-content>
      <Content />
    </a-layout-content>
    <!-- <a-layout-footer>foooter</a-layout-footer> -->
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Content from './components/content/content.vue'

export default defineComponent({
  name: 'App',
  components: {
    Content
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
