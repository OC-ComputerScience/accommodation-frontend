<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import ocLogo from "/oc-logo-docked.svg";
</script>

<template>
  <v-container fluid class="loginGrid fill-height">
    <v-sheet color="sidebar" height="10"></v-sheet>
    <v-card class="mx-auto" max-width="45%">
      <br /><br />
      <v-card-text class="my-10 text-h1 text-center">Welcome!</v-card-text>
      <v-card-text class="my-6 text-h4 text-center">Student ADA Accommodations System</v-card-text>
      <v-card-text class="my-6 text-body-1 text-center">
        Using this system, students can request <strong>academic</strong>, <strong>chapel</strong>, and
        <strong>housing accommodations</strong> to support their experience at OC.
      </v-card-text>
      <v-sheet class="mx-auto" height="60" width="420">
        <v-row align="center" justify="center" style="height: 100%">
          <v-col cols="12" sm="8" md="6">
            <SocialLogin />
          </v-col>
        </v-row>
      </v-sheet>

      <v-card-text class="mb-8 text-body-1 text-center">
        After submitting a request, they will receive an email with a link that includes documentation
        instructions and information on how to schedule an appointment with Student Success.
      </v-card-text>
      
    </v-card>
  </v-container>

</template>

<style scoped>
.right-aligned {
  position: absolute;
  right: 0;
}
.loginGrid {
  background: url(../../public/music_dept.jpg) no-repeat center center fixed;
  background-size: cover;
}
</style>