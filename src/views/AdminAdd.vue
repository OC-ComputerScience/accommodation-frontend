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

async function getAccomm() {
  await accommServices
    .getAll()
    .then((response) => {
      accommodations.value = response.data;
      // console.log('accommodations: ', accommodations.value);
      accommodations.value.forEach((accomm) => {
        accomm.chapelChkBox = false;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getRequest() {
  await requestServices
    .getOne(requestId)
    .then((response) => {
      //console.log(request);
      request.value = response.data;
      semester.value = request.value.semester.semester;
      year.value = request.value.semester.year;
      fName.value = request.value.student.fName;
      lName.value = request.value.student.lName;

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
      console.log("these are the values for accomCategory: " + JSON.stringify(accomCategory.value)); // console.log(accomCategory.value);
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
  console.log("Selected Accommodations:", selectedAccommodations.value);

  let promises = [];
  let catSelected = false;
  let academicsSelected = false;

  for (const accomId in selectedAccommodations.value) {
    if (selectedAccommodations.value[accomId]) {
      const accom = findAccomById(parseInt(accomId));
      if (!accom) continue;

      const studentAccomData = {
        accomId: accom.accomId,
        accomCatId: accom.accomCatId,
        data: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        semesterId: request.value.semesterId,
        studentId: request.value.studentId,
      };

      promises.push(studentAccomServices.create(studentAccomData));

      // Check which categories were selected
      if (accom.categoryName === "Chapel" || accom.categoryName === "Meals" || accom.categoryName === "Housing") {
        catSelected = true;
        selectedAccomCatIds.value.push(accom.accomCatId);
      }
      if (accom.categoryName === "Academics") academicsSelected = true;
    }
  }

  await Promise.all(promises);
  console.log("✅ All selected accommodations saved.");

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
      console.log("✅ Emails processed. Redirecting...");
      router.push({ name: "adminHome" });
    }
  };

  if (catSelected) {
    console.log("📩 Sending Chapel email...");
    const catData = { ...data, accomCatIds: selectedAccomCatIds.value };
    utilServices.emailChapel(catData)
      .then((res) => {
        console.log("✅ Chapel email sent", res.data);
        emailsSent++;
        navigateIfDone();
      })
      .catch((err) => {
        console.error("❌ Chapel email error", err.response || err);
        emailErrors++;
        navigateIfDone();
      });
  }

  if (academicsSelected) {
    console.log("📩 Sending Academics email...");
    utilServices.emailFaculty(data)
      .then((res) => {
        console.log("✅ Academics email sent", res.data);
        emailsSent++;
        navigateIfDone();
      })
      .catch((err) => {
        console.error("❌ Academics email error", err.response || err);
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

      <v-btn class="ml-4" color="blue" style="float: right" @click="save()">save</v-btn>
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
        <button v-if="ac.name === 'Chapel'" @click="sendChapelEmail">
          Send Chapel Email
        </button>
        <button v-if="ac.name === 'Academics'" @click="sendAcademicsEmail">
          Send Academics Email
        </button>
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

    <v-btn class="ml-4" color="blue" style="float: right" @click="save()">save</v-btn>
  </div>
</template>
