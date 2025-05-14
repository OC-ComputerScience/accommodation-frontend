<script setup>
import SemesterServices from "../services/semesterServices";
import { ref, onMounted } from "vue";

import router from "../router";

const semester = ref({});
let semesterRules = [
  (value) => !!value || "Semester is required",
  (value) => /^[A-Z]{2}\d{4}$/.test(value) || "Use XXYYYY must be valid",
];

let dateRules = [
  (value) => !!value || "Date is required",
];

function save() {
  let catData = semester.value;

  SemesterServices.createSemester(catData);
  router.push({ name: "adminSemManage" });
}
function cancel() {
  router.push({ name: "adminSemManage" });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Add Semester </v-row>

  <div class="pa-4">
    <v-card style="background-color: #d5dfe7" class="pa-4">
      <div>
        <div>
          <p class="pl-5" style="font-weight: bold">Semester Name</p>
          <v-text-field
            class="pl-5 pr-5"
            label=""
            v-model="semester.semester"
            :rules="semesterRules"
          ></v-text-field>
          <p class="pl-5" style="font-weight: bold">Start Date</p>
          <v-text-field
            class="pl-5 pr-5"
            label=""
            v-model="semester.startDate"
            :rules="dateRules"
            type="date"
          ></v-text-field>
          <p class="pl-5" style="font-weight: bold">End Date</p>
          <v-text-field
            class="pl-5 pr-5"
            label=""
            v-model="semester.endDate"
            :rules="dateRules"
            type="date"
          ></v-text-field>
        </div>
      </div>
    </v-card>

    <div class="ma-6">
      <v-btn class="ml-4" color="primary" style="float: right" @click="cancel()"
        >cancel</v-btn
      >
      <v-btn
        class="mr-4"
        color="button_blue"
        style="float: right"
        @click="save()"
        >save</v-btn
      >
    </div>
  </div>
</template>
