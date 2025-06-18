<script setup>
import SemesterServices from "../services/semesterServices";
import { ref, onMounted } from "vue";
import router from "../router";

const props = defineProps({
  semesterId: {
    required: true,
  },
});

let semester = ref("");
let semesterRules = [
  (value) => !!value || "Semester is required",
  (value) => /^(FA|WI|SU|SP)\d{4}$/.test(value) || "Use FA, WI, SU, or SP followed by 4 digits (e.g., FA2024)",
];

let dateRules = [
  (value) => !!value || "Date is required",
];

onMounted(async () => {
  await SemesterServices.getSemester(props.semesterId)
    .then((response) => {
      semester.value = response.data;

      semester.value.startDate =
        semester.value.startDate != null
  ? new Date(semester.value.startDate).toISOString().split('T')[0]
  : null;

      semester.value.endDate =
        semester.value.endDate != null
          ? new Date(semester.value.endDate).toISOString().split('T')[0]
          : null;
    })
    .catch((err) => {
      console.log(err);
    });
});

function save() {
  const isValid = semesterRules.every(rule => rule(semester.value.semester) === true);
  if (!isValid) {
    alert("fill out the form correctly");
    return;
  }
  let semesterDat = semester.value;

  SemesterServices.updateSemester(props.semesterId, semesterDat);
  router.push({ name: "adminSemManage" });
}

function cancel() {
  router.push({ name: "adminSemManage" });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Edit Semester </v-row>

  <div class="pa-4">
    <v-card style="background-color: #d5dfe7" class="pa-4">
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
