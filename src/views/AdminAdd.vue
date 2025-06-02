<script setup>
import accommServices from "../services/accommodationServices.js";
import requestServices from "../services/requestServices.js";
import studentAccomServices from "../services/studentAccomServices";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import router from "../router";
import Utils from "../config/utils";
import accomCatServices from "../services/accomCatServices";
import utilServices from "../services/utilServices";
import { watch } from "vue";
import RequestApproval from "../components/RequestApproval.vue";


const accommodations = ref([]);
const request = ref([]);
const selectedAccomCatIds = ref([]);
const route = useRoute();
const accomCategory = ref([]);
const params = computed(() => route.params);
const requestId = route.params.id;
const semester = ref();
const year = ref();
const fName = ref();
const lName = ref();
const subject = ref();
const body = ref("");
const recipient = ref("");
let user = Utils.getStore("user");
const approval = ref(false);
const selectedAccoms = ref(null);


async function getAccomm() {
  await accommServices
    .getAll()
    .then((response) => {
      accommodations.value = response.data;
      accommodations.value.forEach((accomm) => {
        accomm.chapelChkBox = false;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getSelectedAccom(studentId, semesterId) {
  studentAccomServices
    .getAllForStudent(studentId)
    .then((response) => {
      selectedAccoms.value = response.data.filter(item => item.semesterId === semesterId).map(item => item.accomId);
      selectedAccoms.value.forEach(id => {
        selectedAccommodations.value[id] = true;
      })
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getRequest() {
  await requestServices
    .getOne(requestId)
    .then((response) => {
      request.value = response.data;
      semester.value = request.value.semester.semester;
      year.value = request.value.semester.year;
      fName.value = request.value.student.fName;
      lName.value = request.value.student.lName;
      getSelectedAccom(request.value.studentId, request.value.semesterId);

    })
    .catch((err) => {
      console.log(err);
    });
}
async function getAccomCat() {
  await accomCatServices
    .getAll()
    .then((response) => {
      accomCategory.value = response.data;
      accomCategory.value = response.data.filter(
        item =>
          item.name !== "student_accommodation_request_received" &&
          item.name !== "student_accommodation_approved"
      );
      subject.value = accomCategory.value.accomcat;
    })
    .catch((err) => {
      console.log(err);
    });

}
onMounted(async () => {
  await getAccomm();
  await getRequest();
  await getAccomCat();
});

const selectedAccommodations = ref([]);

function cancel() {
  router.push({ name: "adminHome" });
}



async function save() {

  let catSelected = false;
  let academicsSelected = false;

  const studentAccoms = [];

  for (const accomId in selectedAccommodations.value) {
    if (selectedAccommodations.value[accomId]) {
      const accom = findAccomById(parseInt(accomId));
      if (!accom) continue;

      studentAccoms.push({
        accomId: accom.accomId,
        accomCatId: accom.accomCatId,
        data: null,
        semesterId: request.value.semesterId,
        studentId: request.value.studentId,
      });

      if (["Chapel", "Meals", "Housing"].includes(accom.categoryName)) {
        catSelected = true;
        selectedAccomCatIds.value.push(accom.accomCatId);
      }
      if (accom.categoryName === "Academics") academicsSelected = true;
    }
  }

  // ✅ Now send everything in ONE request
  await studentAccomServices.create({
    studentAccoms,
    studentId: request.value.studentId,
    semesterId: request.value.semesterId,
  });



  await requestServices.update(requestId, {
    approvedBy: user.fName + " " + user.lName,
    status: "Closed",
  });

  // Prepare data to send in email
  const data = {
    studentId: request.value.studentId,
    semesterId: request.value.semesterId,
  };

  let emailsSent = 0;
  let emailErrors = 0;

  const navigateIfDone = () => {
    if ((catSelected || academicsSelected) && (emailsSent + emailErrors >= (catSelected + academicsSelected))) {
      router.push({ name: "adminHome" });
    }
  };

  if (catSelected) {
    const catData = { ...data, accomCatIds: selectedAccomCatIds.value };
    utilServices.emailCategoryTemplate(catData)
      .then((res) => {
        emailsSent++;
        navigateIfDone();
      })
      .catch((err) => {
        emailErrors++;
        navigateIfDone();
      });
  }

  if (academicsSelected) {
    utilServices.emailFaculty(data)
      .then((res) => {
        emailsSent++;
        navigateIfDone();
      })
      .catch((err) => {
        emailErrors++;
        navigateIfDone();
      });
  }

  if (!catSelected && !academicsSelected) {
    // No emails to send
    router.push({ name: "adminHome" });
  }
}



function findAccomById(id) {
  for (let a of accommodations.value) {
    if (a.accomId == id) return a;
  }
  return null;
}
</script>

<template>
  <div class="ma-6">
    <div>
      <p class="text-h5" style="font-weight: bold">Add Accommodations</p>

      <v-btn class="ml-4" color="primary" style="float: right" @click="cancel()">cancel</v-btn>

      <v-btn class="ml-4" color="blue" style="float: right" @click="approval = true">save</v-btn>
    </div>
    <p style="font-weight: bold" class="pt-2 pl-4 text-h5">
      {{ fName }} {{ lName }}
    </p>

    <p style="font-weight: bold" class="pt-2 pl-4 text-h5">{{ semester }}</p>
  </div>

  <div v-for="ac in accomCategory">
    <div class="ml-10 mr-16">
      <div class="pb-5">
        <p class="text-h6">{{ ac.name }}</p>
        <div>
          <v-card class="rounded-0" style="background-color: #d5dfe7">
            <div v-for="a in accommodations" :key="a.id">
              <v-checkbox v-if="a.categoryName == ac.name" v-model="selectedAccommodations[a.accomId]" :value="a.id"
                :label="a.title" color="primary" style="font-weight: bold; color: black">
              </v-checkbox>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>

  <div class="ma-6">
    <v-btn class="ml-4" color="primary" style="float: right" @click="cancel()">cancel</v-btn>

    <v-btn class="ml-4" color="blue" style="float: right" @click="approval = true">save</v-btn>
  </div>
  <!--Dialog box-->
  <v-dialog v-model="approval" width="auto">
    <RequestApproval :selectedAccoms="selectedAccommodations" :accommodations="accommodations" @save="save()"
      @cancel="(approval = false)" />
  </v-dialog>
</template>
