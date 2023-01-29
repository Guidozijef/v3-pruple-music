<template>
  <main-page></main-page>
  <div class="mainContainer">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import MainPage from "./components/MainPage.vue";
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
}

.mainContainer {
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 52px;
  left: 70px;
  background-color: #fff;
  width: calc(100% - 70px);
  height: calc(100% - 122px);
  // box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.3);
  box-shadow: -5px 3px 13px rgba(0, 0, 0, 0.2);
}
</style>
