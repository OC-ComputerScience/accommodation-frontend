<script setup>
import { ref, computed } from "vue";
const emit = defineEmits(['createRequest', 'cancel'])

const selectedSemId = ref(null);
const props = defineProps({
  semesters: Array,
  isReqWithinOneYear: Boolean
});

const showModal = ref(false);

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
const handleSubmit = () => {

  if (props.isReqWithinOneYear) {
    showModal.value = true;
  } else {
    // Proceed with normal submit
    emit('createRequest', selectedSemId.value);
  }

}

const selectApprovalType = (approvalType) => {
  showModal.value = false;
  // Emit the createRequest event with the selected approval type
  emit('createRequest', selectedSemId.value, approvalType);
}
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
      <v-combobox v-model="selectedSemId" label="Semester" :items="filteredSemesters" item-title="semester"
        return-object variant="underlined" style="float: left; width: 60%; padding-left: 16px"></v-combobox>
      <v-btn @click="handleSubmit" rounded="lg" elevation="2" style="
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


    <!-- Conditional Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>Approval Type</v-card-title>
        <v-card-text>
          Do you want automatic or manual approval?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="selectApprovalType('auto')" rounded="lg" elevation="2" style="
          background-color: #118acb;
          color: white;
          float: right;
          margin-right: 24px;
        ">
            Automatic
          </v-btn>
          <v-btn @click="selectApprovalType('manual')" rounded="lg" elevation="2" style="
          background-color: #118acb;
          color: white;
          float: right;
          margin-right: 24px;
        ">
            Manual
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
