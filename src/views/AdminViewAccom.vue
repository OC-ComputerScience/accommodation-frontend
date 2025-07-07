<script setup>
import AccommodationServices from "../services/accommodationServices.js";
import accomCatServices from "../services/accomCatServices";
import { ref, onMounted, computed } from "vue";
import router from "../router";

const accoms = ref([]);
const cats = ref([]);
const select = ref([]);
const selectedCategoryFilter = ref('');

const categoryFilterOptions = computed(() => {
  const uniqueCategories = [...new Set(accoms.value.map(accom => accom.categoryName).filter(Boolean))];
  return ['All Categories', ...uniqueCategories.sort()];
});

// Update your computed property to track original indices
const filteredAccoms = computed(() => {
  let filtered;
  if (!selectedCategoryFilter.value || selectedCategoryFilter.value === 'All Categories') {
    filtered = accoms.value.map((accom, index) => ({ ...accom, originalIndex: index }));
  } else {
    filtered = accoms.value
      .map((accom, index) => ({ ...accom, originalIndex: index }))
      .filter(accom => accom.categoryName === selectedCategoryFilter.value);
  }
  return filtered;
});

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
  // Create paired arrays for sorting
  const paired = accoms.value.map((accom, index) => ({
    accom,
    category: select.value[index] || ''
  }));
  
  // Sort by category
  paired.sort((a, b) => a.category.localeCompare(b.category));
  
  // Update both arrays
  accoms.value = paired.map(item => item.accom);
  select.value = paired.map(item => item.category);
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
  router.go();
}
function changeStatus(data) {
  if (data.status == "Inactive") data.status = "active";
  else data.status = "Inactive";
  AccommodationServices.update(data.accomId, data)
  router.go();
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

  <div class="filter-section pa-4">
    <v-select
      v-model="selectedCategoryFilter"
      :items="categoryFilterOptions"
      label="Filter by Category"
      clearable
      dense
      outlined
      width="30%"
    ></v-select>
  </div>

  <div class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          <th class="text-left">Category</th>
        </tr>
      </thead>

      <tr v-for="(a, index) in filteredAccoms" :key="a.originalIndex" style="background-color: #d5dfe7">
        <td class="pa-4">{{ a.title }}</td>
        <td>{{ a.description }}</td>
        <td>
          <v-combobox
            :items="cats.map((cat) => cat.name)"
            label="category"
            v-model="select[a.originalIndex]"
          ></v-combobox>
        </td>
        <td class="pa-4">
  <div class="d-flex flex-wrap justify-end ga-2">
    <v-btn
      color="primary"
      style="min-width: 10em;"
      @click="changeStatus(a)"
    >
      {{ a.status === "active" ? "deactivate" : "activate" }}
    </v-btn>
    <v-btn
      color="button_blue"
      @click="save(a, a.originalIndex)"
    >
      save
    </v-btn>
    <v-btn
      color="button_blue"
      @click="editAccom(a.accomId)"
    >
      edit
    </v-btn>
  </div>
</td>
      </tr>
    </v-table>
  </div>
</template>
