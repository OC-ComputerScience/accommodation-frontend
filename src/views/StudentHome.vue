<script setup>
import RequestForm from "../components/RequestForm.vue";
import Permissions from "../components/Permissions.vue";
import RequestSuccess from "../components/RequestSuccess.vue";

import router from "../router";
import { onBeforeMount, ref, watch } from "vue";
import RequestServices from "../services/requestServices";
import StudentServices from "../services/studentServices";
import StudentAccomServices from "../services/studentAccomServices";
import Utils from "../config/utils";
import SemesterServices from "../services/semesterServices";
import userServices from "../services/userServices";


const user = ref(null);
const requestForm = ref(false);
const noPermission = ref(false);
const student = ref({});
const allRequests = ref([]);
const studentAccoms = ref([]);
const filteredSemesterAccoms = ref([]);
const isVisible = ref(false);
const openRequestCount = ref(0);
const selectedSemId = ref();
const isReqWithinOneYear = ref(false);

const semesters = ref([]);

var tableHeaders = [
  { title: "Semester", key: "semester.semester" },
  { title: "Category", key: "accommodation.categoryName" },
  { title: "Title", key: "accommodation.title" },
];
user.value = Utils.getStore("user");

onBeforeMount(async () => {
  await findStudent();
  await getSemesters();
  await updateOpenRequestCount();
  await getStudentAccoms();
  await getLatestApprovedRequest();
});

const getSemesters = async () => {
  await SemesterServices.getAllSemesters()
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((e) => {
      console.log(e.response);
    });
};

const getLatestApprovedRequest = async () => {
  await RequestServices.findLatestApproved(
    user.value.studentId
  ).then((response) => {
    const dateApproved = new Date(response.data.dateApproved);
    const today = new Date();

    // Calculate the time difference
    const oneYearLater = new Date(dateApproved);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Check: is today after dateApproved AND before or equal to oneYearLater
    isReqWithinOneYear.value =
      today >= dateApproved && today <= oneYearLater;

  }) 
  .catch((e) => {
    isReqWithinOneYear.value = false;
    console.log(e.response);
  })
}

//STUDENT noPermission METHODS

const findStudent = async () => {
  if (user.value.studentId) {
    await StudentServices.getOne(user.value.studentId)
      .then((response) => {
        student.value = response.data;
        noPermission.value = !student.value.permission;
      })
      .catch(async (err) => {
        if (err.response && err.response.status === 404) {
          console.log("Error reading student" + err);
        }
      });
  } else {
    noPermission.value = true;
  }
};

const createStudent = async (ocStudentId) => {
  user.value = Utils.getStore("user");
  const data = {
    ocStudentId: ocStudentId,
    fName: user.value.fName,
    lName: user.value.lName,
    email: user.value.email,
    permission: 1,
    version: 1.1,
  };
  await StudentServices.create(data)
    .then(async (response) => {
      student.value = response.data;
      await userServices.update(user.value.userId, {
        studentId: student.value.studentId,
      });
    })
    .then(() => {
      user.value.studentId = student.value.studentId;
      Utils.setStore("user", user.value);
    })
    .catch((err) => {
      console.error(err);
    });

  return student;
};

const addConsent = async (ocStudentId) => {
  if (user.value.studentId) {
    let studentData = {
      permission: 1,
      dateSigned: new Date(),
      ocStudentId: ocStudentId,
    };
    await StudentServices.update(user.value.studentId, studentData).catch(
      (err) => {
        console.log(err);
      }
    );
  } else {
    await createStudent(ocStudentId).catch((err) => {
      console.log(err);
    });
  }
  noPermission.value = false;
};

//END STUDENT noPermission METHODS

//CREATE REQUEST METHODS
const handleCreate = (selectedSemId, approvalType='manual') => {
  createRequest(selectedSemId, approvalType);
  requestForm.value = false;
  isVisible.value = true;
};

const toggleClose = () => {
  isVisible.value = false;
}

const createRequest = async (selectedSemId, approvalType) => {

  if (!student.value.studentId) {
    console.error("Error: studentId is undefined. Cannot create request.");
    return;
  }
  const data = {
    semesterId: selectedSemId.semesterId,
    studentId: student.value.studentId,
    email: student.value.email,
    approvalType: approvalType
  };
  console.log(data);

  await RequestServices.create(data)
    .then((response) => {})
    .catch((e) => {
      console.log(e.response.data.message);
    });

  updateOpenRequestCount();
};

const getStudentAccoms = async () => {
  await StudentAccomServices.getAllForStudent(student.value.ocStudentId)
    .then((response) => {
      studentAccoms.value = response.data;
      filteredSemesterAccoms.value = studentAccoms.value;
    })
    .catch((e) => {
      console.log(e);
    });
};

const fileterRequestBySemester = () => {
  if (selectedSemId.value == null) {
    filteredSemesterAccoms.value = studentAccoms.value;
    return;
  }
  filteredSemesterAccoms.value = studentAccoms.value.filter(
    (item) => item.semesterId == selectedSemId.value.semesterId
  );
};

const updateOpenRequestCount = async () => {
  openRequestCount.value = 0;
  await RequestServices.getAllForStudent(student.value.studentId).then(
    (response) => {
      allRequests.value = response.data;

      allRequests.value.forEach((item) => {
        if (item.status == "Open") {
          openRequestCount.value++;
        }
      });
    }
  );
};
watch(selectedSemId, () => {
  fileterRequestBySemester();
});

//END CREATE REQUEST METHODS
</script>


<template>
<RequestSuccess
v-show="isVisible"
@click="toggleClose()">
</RequestSuccess>
  <div class="pa-5">
  
    <div>
      <p class="text-h6 text-left">Hello, {{ user.fName }}!</p>
      <v-card-text class="my-1 text-body-1 text-center">
        Using this system, you can request <strong>academic</strong>, <strong>chapel</strong>, and
        <strong>housing accommodations</strong> to support your experience at OC. <br>
        After submitting a request, you will receive an email with a link that includes documentation
        instructions and information on how to schedule an appointment with Student Success.
      </v-card-text>
      <p class="text-h6 mt-4 text-left">
        My Requests
        <v-btn
          @click="requestForm = true"
          class="mr-15"
          rounded="lg"
          elevation="2"
          style="background-color: #118acb; color: white; float: right"
        >
          MAKE A REQUEST
        </v-btn>
      </p>
    </div>
    <v-card class="pa-7 mt-5 mr-15" style="background-color: #d5dfe7">
      <p v-if="openRequestCount == 0">No open requests.</p>
      <p v-else>
        You have {{ openRequestCount }} open request{{
          openRequestCount > 1 ? "s" : ""
        }}.
      </p>
    </v-card>

    <p class="mt-5 text-h6 text-left">
      My Accomodations
      <v-combobox
        label="Semester"
        v-model="selectedSemId"
        :items="semesters"
        item-title="semester"
        style="width: 15rem"
        class="semesterBox mt-3"
        return-object
        clearable
      ></v-combobox>
    </p>

    <v-card class="mt-3 pa-7 mr-15" style="background-color: #d5dfe7">
      <p v-if="filteredSemesterAccoms.length == 0">
        You have no accommodations for this semester.
      </p>
      <v-data-table
        :items="filteredSemesterAccoms"
        :headers="tableHeaders"
      ></v-data-table>
    </v-card>
    <v-dialog v-model="requestForm" width="auto">
      <RequestForm
        :semesters="semesters"
        :isReqWithinOneYear="isReqWithinOneYear"
        @createRequest="handleCreate"
        @cancel="requestForm = false"
      />
    </v-dialog>
    <v-dialog persistent v-model="noPermission" width="auto">
      <Permissions
        @signedForm="addConsent"
        @cancel="router.push({ name: 'login' })"
      />
    </v-dialog>
  </div>
</template>

