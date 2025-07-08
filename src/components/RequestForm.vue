<script setup>
import { ref, onMounted, computed } from "vue";

const selectedSemId = ref(null);
const props = defineProps({
  semesters: Array,
});

const filteredSemesters = computed(() => {
  const currentDate = new Date();
  return props.semesters
    .filter(semester => {
      const semesterEndDate = new Date(semester.endDate);
      return semesterEndDate >= currentDate;
    })
    .sort((a, b) => {
      const [seasonA, yearA] = a.semester.split('-');
      const [seasonB, yearB] = b.semester.split('-');
      if (yearA === yearB) {
        return seasonA === 'SP' ? -1 : 1;
      }
      return yearA - yearB;
    });
});
</script>

<template>
  <v-container>
    <v-card
      elevation="5"
      rounded="lg"
      width="20rem"
      style="padding-bottom: 16px; padding-left: 16px"
    >
      <v-card-title>Select The Semester</v-card-title>
      <v-combobox
        v-model="selectedSemId"
        label="Semester"
        :items="filteredSemesters"
        item-title="semester"
        return-object
        variant="underlined"
        style="float: left; width: 60%; padding-left: 16px"
      ></v-combobox>
      <v-btn
        @click="$emit('createRequest', selectedSemId)"
        rounded="lg"
        elevation="2"
        style="
          background-color: #118acb;
          color: white;
          float: right;
          margin-right: 24px;
        "
      >
        Submit Request
      </v-btn>
      <v-btn
        flat
        @click="$emit('cancel')"
        rounded="lg"
        elevation="2"
        style="
          background-color: silver;
          color: black;
          float: right;
          margin-right: 16px;
        "
      >
        Cancel
      </v-btn>
    </v-card>
  </v-container>
</template>
