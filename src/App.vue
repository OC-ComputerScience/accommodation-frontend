<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
import router from "./router";
//import SideBar from "./components/SideBar.vue";
// Removed from script:
/*
    <MenuBar :key="$route.fullPath" />
    <SideBar :key="$route.fullPath" />
*/
</script>

<template>
  <v-app>
    <v-main>
      <MenuBar v-if="$route.fullPath != '/'" />
      <v-container v-if="$route.fullPath != '/'">
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
      <router-view v-else :key="$route.fullPath"></router-view>  
    </v-main>
  </v-app>
</template>
