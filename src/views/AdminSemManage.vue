<script setup>
import SemesterServices from "../services/semesterServices";
import { ref, onMounted } from "vue";
import router from "../router";

const semesters = ref([]);
const select = ref([]);

async function getSemesters() {
  await SemesterServices.getAllSemesters()
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getSemesters();
});

function deleteSem(semesterId) {
  SemesterServices.deleteSemester(semesterId)
    .then(() => {
      getSemesters();
    })
    .catch((error) => {
      console.error("Error deleting semester:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      }
    });
}

function editSem(semesterId) {
  router.push({ name: "adminSemEdit", params: { semesterId: semesterId } });
}
function addSem() {
  router.push({ name: "adminSemAdd" });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Manage Semesters</v-row>

  <v-row>
    <v-spacer></v-spacer>
    <v-btn class="mr-4" color="#800000" style="float: right" @click="addSem()"
      >New Semester</v-btn
    >
  </v-row>
  <v-row class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Semester</th>
        </tr>
      </thead>

      <tr v-for="(a, index) in semesters" style="background-color: #d5dfe7">
        <td class="pa-4">{{ a.semester }}</td>

        <td>
          <v-btn
            class="mr-4"
            color="primary"
            style="float: right"
            @click="deleteSem(a.semesterId)"
            >delete</v-btn
          >
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="editSem(a.semesterId)"
            >edit</v-btn
          >
        </td>
      </tr>
    </v-table>
  </v-row>
</template>
