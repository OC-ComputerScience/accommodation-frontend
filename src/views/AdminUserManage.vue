<script setup>
import { ref, onMounted } from "vue";
import UserServices from "../services/userServices.js";
import router from "../router";

const users = ref([]);
const roles = ["admin", "student", "disabled"];
const select = ref([]);

async function getUsers() {
  try {
    const response = await UserServices.getAll();
    users.value = response.data;
    setRoles();
    setDefaultRoleValues();
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
function setRoles() {
  const uniqueRoles = new Set(users.value.map((item) => item.role));
  roles.value = Array.from(uniqueRoles);
}
function setDefaultRoleValues() {
  select.value = users.value.map((user) => user.role);
}
onMounted(async () => {
  await getUsers();
});

function save(user, index) {
  let userData = {
    role: select.value[index],
  };
  UserServices.update(user.id, userData);
  this.router.go();
}
function deleteUser(id) {
  UserServices.delete(id);
  this.router.go();
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Manage Users </v-row>

  <div class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Last</th>
          <th class="text-left">First</th>
          <th class="text-left">Email</th>
          <th class="text-left">Role</th>
          <th class="text-left">Std. ID</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>

      <tr v-for="(u, index) in users" style="background-color: #d5dfe7">
        <td class="pa-4">{{ u.id }}</td>
        <td>{{ u.lName }}</td>
        <td>{{ u.fName }}</td>
        <td>{{ u.email }}</td>
        <td>
          <v-combobox
            :items="roles"
            label="roles"
            v-model="select[index]"
          ></v-combobox>
        </td>
        <td class="pa-4">{{ u.studentId }}</td>
        <td class="pa-4">
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="save(u, index)"
            >save</v-btn
          >
        </td>
      </tr>
    </v-table>
  </div>
</template>
