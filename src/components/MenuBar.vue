<script setup>
import ocLogo from "/oc-logo-red.svg";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import router from "../router";

const user = ref(null);
const title = ref("Student Accommodations");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const homePage = ref("");

const maintainenceActions = [
  {
    title: "Accommodations",
    component: "adminViewAccom",
  },
  {
    title: "Categories",
    component: "adminCatManage",
  },
  {
    title: "Users",
    component: "adminUserManage",
  },
  {
    title: "Semesters",
    component: "adminSemManage",
  },
  {
    title: "Emails",
    component: "adminEmailManage",
  },
  {
    title: "Email Logs",
    component: "adminEmailLogs",
  },
];

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const findHome = () => {
  user.value = Utils.getStore("user");
  homePage.value = user.value.role == "admin" ? "adminHome" : "studentHome";
};

const logout = () => {
  let data = {
    token: user.value.token,
  };
  AuthServices.logoutUser(data)
    .then((response) => {
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
      router.push({ name: "login" });
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
  findHome();
});
</script>

<template>
  <div>
    <v-app-bar app color="primary" height="80">
      <router-link :to="{ name: homePage.valueOf() }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="80"
          width="80"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-if="user?.role == 'admin'" class="mr-2">
        <v-btn @click="router.push({ name: 'adminHome' })"> Home </v-btn>

        <v-btn @click="router.push({ name: 'adminStudentAccom' })">
          Student Accommodations
        </v-btn>
        <v-btn>
          Maintain

          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(item, index) in maintainenceActions"
                :key="index"
                :value="index"
                @click="router.push({ name: item.component })"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>

      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
