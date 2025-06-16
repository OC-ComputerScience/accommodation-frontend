<script setup>
import accomCatServices from "../services/accomCatServices";
import { ref, onMounted } from "vue";
import router from "../router";

const cats = ref([]);

async function getAccomCats() {
  try {
    const response = await accomCatServices.getAll();
    cats.value = response.data;
  } catch (err) {
    console.log(err);
  }
}

onMounted(async () => {
  await getAccomCats();
});

function deleteCat(accomCatId) {
  accomCatServices
    .delete(accomCatId)
    .then(() => {
      console.log("Category deleted successfully.");
      router.go();
    })
    .catch((error) => {
      console.error("Error deleting category:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      }
    });
}

function editCat(accomCatId) {
  router.push({ name: "adminCatEdit", params: { accomCatId: accomCatId } });
}
function addCat() {
  router.push({ name: "adminCatAdd" });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Manage Categories </v-row>

  <v-row>
    <v-spacer></v-spacer>
    <v-btn class="mr-4" color="#800000" style="float: right" @click="addCat()"
      >New Accommodation Category</v-btn
    >
  </v-row>
  <div class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Email</th>
        </tr>
      </thead>

      <tr v-for="(a, index) in cats" style="background-color: #d5dfe7">
        <td class="pa-4">{{ a.name }}</td>
        <td class="pa-4">{{ a.email }}</td>
        <td>
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="editCat(a.accomCatId)"
            :disabled="a.restricted === true"
            >edit</v-btn
          >
        </td>
      </tr>
    </v-table>
  </div>
</template>
