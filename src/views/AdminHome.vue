<script setup>
import { ref, onMounted } from "vue";
import RequestServices from "../services/requestServices.js";
import SemesterServices from "../services/semesterServices.js";
import moment from "moment";
import CloseModal from "../components/CloseModal.vue";
import router from "../router";

// Holds all open requests with their associated Student
const openRequests = ref([]);
const unfilteredClosedRequests = ref([]);
const closedRequests = ref([]);
const openReqBool = ref(false);
const closedReqBool = ref(false);
const closeModal = ref(false);
const selectedRequest = ref(null);
const showFilterMenu = ref(false);

const semesterFilter = ref(null);
const studentNameFilter = ref(null);
const semesters = ref(null);
let requestData = ref(null);

onMounted(async () => {
  await getSemesters();
  await loadRequests();
});

const getSemesters = async () => {
  await SemesterServices.getAllSemesters().then((response) => {
    semesters.value = response.data;
    semesterFilter.value = semesters.value[0];
  });
};

const loadRequests = async () => {
  try {
    getOpenRequests();
    await getClosedRequests();
    filterClosedRequests();

    //requestData = response.data;
  } catch (error) {
    console.error(error);
  }
};

const getOpenRequests = async () => {
  const response = await RequestServices.getAllForStatus("Open");
  openRequests.value = response.data;
  openReqBool.value = response.data.length > 0;
};

const getClosedRequests = async () => {
  const response = await RequestServices.getAllForStatus("Closed");
  closedRequests.value = response.data;
  unfilteredClosedRequests.value = response.data;
  closedReqBool.value = response.data.length > 0;
};

const filterClosedRequests = () => {
  closedReqBool.value = true;

  const filteredReqs = unfilteredClosedRequests.value.filter((request) => {
    let inFilter = true;
    if (
      semesterFilter.value &&
      request.semesterId != semesterFilter.value.semesterId
    ) {
      inFilter = false;
    }
    if (
      studentNameFilter.value &&
      !(request.student.fName + " " + request.student.lName)
        .toLowerCase()
        .includes(studentNameFilter.value.toLowerCase())
    ) {
      inFilter = false;
    }
    return inFilter;
  });
  closedRequests.value = filteredReqs;
  showFilterMenu.value = false;

  if (filteredReqs.length < 1) {
    closedReqBool.value = false;
  }
};

const clearFilters = () => {
  semesterFilter.value = null;
  studentNameFilter.value = null;
  closedRequests.value = unfilteredClosedRequests.value;
  showFilterMenu.value = false;
  closedReqBool.value = true;
};

const formatDate = (date) => {
  return moment(String(date)).format("MM/DD/YYYY");
};

const addAccom = (request) => {
  // Add code here to change the route.
  // Pass in the request object so you can get the student info??
  // Can change the parameters of this if necessary

  router.push({ name: "adminAdd", params: { id: request.requestId } });
};

const closeRequest = (request) => {
  const updatedRequest = {
    requestId: request.requestId,
    dateMade: request.dateMade,
    approvedBy: null,
    status: "Closed",
    semester: request.semester,
    studendId: request.studentId,
  };

  RequestServices.update(updatedRequest.requestId, updatedRequest)
    .then(() => {
      loadRequests();
    })
    .catch((e) => {
      console.log("Close failed");
      console.log(e.response.data.message);
    });
  selectedRequest.value = null;
  closeModal.value = false;
};
</script>

<template>
  <v-container @click.stop>
    <h1>Open Requests</h1>
    <v-table v-if="openReqBool" fixed-header height="20%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Student ID</th>
          <th>Email</th>
          <th>Date Opened</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in openRequests" :key="request.studentId">
          <td>{{ `${request.student.fName} ${request.student.lName}` }}</td>
          <td student-id="{{request.studendId}}">{{ request.studentId }}</td>
          <td>{{ request.student.email }}</td>
          <td>{{ formatDate(request.dateMade) }}</td>
          <td>
            <!--TODO: Add function call stubs to both these-->
            <!--Add will router-link to AddAccom page--make sure I know what this page is called-->
            <v-btn color="button_blue" @click="addAccom(request)"
              >Approve Request
            </v-btn>
            <!--Close should open a dialog box asking if the user is sure which allows closing of the request without adding accommodations-->
            <v-btn
              flat
              color="primary"
              @click="(closeModal = true), (selectedRequest = request)"
              >Close
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <!--If no open requests, display this v-card-->
    <v-card v-else color="silver" class="pa-4 mt-2">
      <p>No open requests.</p>
    </v-card>
    <br />
    <v-divider></v-divider>
    <br />
    <v-row no-gutters>
      <h1>Closed Requests</h1>
      <v-menu v-model="showFilterMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            size="medium"
            class="font-weight-semi-bold bg-button_blue ml-6 px-2 my-1 mainCardBorder text-none"
            v-bind="props"
          >
            <template v-slot:append>
              <v-icon
                :icon="showFilterMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></v-icon>
            </template>
            Filters
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item
                v-if="semesters"
                class="pa-0 font-weight-semi-bold text-darkBlue"
              >
                Semesters
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="pt-0 mt-0"
                  v-model="semesterFilter"
                  :items="semesters"
                  item-title="semester"
                  item-value="id"
                  return-object
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Student Name
                <v-text-field
                  color="darkBlue"
                  variant="underlined"
                  class="pt-0 mt-0"
                  v-model="studentNameFilter"
                  :items="semesters"
                  item-title="name"
                  item-value="id"
                  return-object
                ></v-text-field>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterClosedRequests(), (showFilterMenu = false)"
              class="bg-button_blue text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="semesterFilter || studentNameFilter"
              @click="clearFilters"
              class="bg-primary ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="semesterFilter || studentNameFilter"
        size="medium"
        color="primary"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
    </v-row>

    <v-table v-if="closedReqBool" fixed-header height="20%">
      <thead>
        <tr>
          <th>Semester</th>
          <th>Name</th>
          <th>Student ID</th>
          <th>Email</th>
          <th>Date Opened</th>
          <th>Approved By</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in closedRequests" :key="request.id">
          <td>{{ request.semester.semester }}</td>
          <td>{{ `${request.student.fName} ${request.student.lName}` }}</td>
          <td>{{ request.studentId }}</td>
          <td>{{ request.student.email }}</td>
          <td>{{ formatDate(request.dateMade) }}</td>
          <td>{{ request.approvedBy }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-card v-else color="silver" class="pa-4 mt-2">
      <p>
        No closed requests{{
          semesterFilter || studentNameFilter
            ? " for the current filter selection"
            : ""
        }}.
      </p>
    </v-card>
  </v-container>

  <!--Dialog box-->
  <v-dialog v-model="closeModal" width="auto">
    <CloseModal
      :selectedRequest="selectedRequest"
      @handleClose="closeRequest(selectedRequest)"
      @cancel="(closeModal = false), (selectedRequest = null)"
    />
  </v-dialog>
</template>
<style></style>