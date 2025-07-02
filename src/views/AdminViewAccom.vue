<script setup>
import AccommodationServices from "../services/accommodationServices.js";
import accomCatServices from "../services/accomCatServices";
import { ref, onMounted } from "vue";
import router from "../router";

const accoms = ref([]);
const cats = ref([]);
const select = ref([]);

async function getAccommodations() {
  try {
    const response = await AccommodationServices.getAll();
    accoms.value = response.data;
  } catch (err) {
    console.log(err);
  }
}
async function getAccomCats() {
  try {
    const response = await accomCatServices.getAll();
    cats.value = response.data;
    setCategories();
    setDefaultCatValues();
  } catch (err) {
    console.log(err);
  }
}
function setCategories() {
  const uniqueCategories = new Set(cats.value.filter((item) => item.restricted == false).map((item) => item.name));
  cats.value = Array.from(uniqueCategories).map((name) => ({ name }));
}
function setDefaultCatValues() {
  select.value = accoms.value.map((accom) => accom.categoryName);
}
onMounted(async () => {
  await getAccommodations();
  await getAccomCats();
  setDefaultCatValues();
});

function save(a, index) {
  let accomData = {
    categoryName: select.value[index],
  };
  AccommodationServices.update(a.accomId, accomData);
  this.router.go();
}
function changeStatus(data) {
  if (data.status == "Inactive") data.status = "active";
  else data.status = "Inactive";
  AccommodationServices.update(data.accomId, data)
  this.router.go();
}
function newAccom() {
  router.push({ name: "adminAccomManage" });
}
function editAccom(x) {
  router.push({ name: "adminEditAccom", params: { accomID: x } });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Manage Accommodations </v-row>

  <v-row>
    <v-spacer></v-spacer>
    <v-btn class="mr-4" color="#800000" style="float: right" @click="newAccom()"
      >New Accommodation</v-btn
    >
  </v-row>

  <div class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          <th class="text-left">Category</th>
        </tr>
      </thead>

      <tr v-for="(a, index) in accoms" style="background-color: #d5dfe7">
        <td class="pa-4">{{ a.title }}</td>
        <td>{{ a.description }}</td>
        <td>
          <v-combobox
            :items="cats.map((cat) => cat.name)"
            label="category"
            v-model="select[index]"
          ></v-combobox>
        </td>
        <td class="pa-4">
          <v-btn
            class="mr-4"
            color="primary"
            style="float: right; min-width: 10em;"
            @click="changeStatus(a)"
            > {{a.status === "active" ? "deactivate" : "activate"}}</v-btn
          >
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="save(a, index)"
            >save</v-btn
          >
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="editAccom(a.accomId)"
            >edit</v-btn
          >
        </td>
      </tr>
    </v-table>
  </div>
</template>
