<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import ocLogo from "/oc-logo-docked.svg";
</script>

<template>
  <v-app-bar app color="primary" height="120">
    <v-img class="right-aligned" :src="ocLogo" width="140"></v-img>
  </v-app-bar>
  <v-sheet color="sidebar" height="10"></v-sheet>
  <v-card>
    <br /><br />
    <v-card-text class="my-10 text-h1">Welcome!</v-card-text>
    <v-card-text class="my-10 text-h4"
      >Student ADA Accommodations System</v-card-text
    >
    <v-card-text class="my-10 text-h6">Using this system will allow a student to make a requests for academic, chapel, housing accommodations that will help them with their experience at OC. Once a request is made the student will receive an email with a link with instructions about the documentation they will need and how to schedule an appointment with Student Success to review their request.</v-card-text>
    <v-sheet class="mx-auto" height="60" width="420">
      <v-row align="center" justify="center" style="height: 100%">
        <v-col cols="12" sm="8" md="6">
          <SocialLogin />
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>

<style scoped>
.right-aligned {
  position: absolute;
  right: 0;
}
</style>