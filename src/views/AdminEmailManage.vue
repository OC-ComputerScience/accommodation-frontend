<script setup>
import emailMessageServices from "../services/emailMessageServices";
import { ref, onMounted } from "vue";
import router from "../router";

const emails = ref([]);
const select = ref([]);

async function getEmailMessages() {
  try {
    const response = await emailMessageServices.getAll();
    emails.value = response.data;
    setEmailMessages();
    setDefaultEmailMessageValues();
  } catch (err) {
    console.log(err);
  }
}
function setEmailMessages() {
  const uniqueEmailMessages = new Set(
    emails.value.map((item) => item.name, item.description.item.text)
  );
  emails.value = Array.from(uniqueEmailMessages).map((name) => ({ name }));
}
function setDefaultEmailMessageValues() {
  select.value = emails.value.map((emailMessage) => emailMessage.name);
  select.value = emails.value.map((emailMessage) => emailMessage.description);
  select.value = emails.value.map((emailMessage) => emailMessage.text);
}

onMounted(async () => {
  await getEmailMessages();
  setDefaultEmailMessageValues();
});

function deleteEmailMessage(emailMessageId) {
  console.log("Trying to delete email with messageId: " + emailMessageId);
  emailMessageServices
    .delete(emailMessageId)
    .then(() => {
      console.log("Email Message deleted successfully.");
      router.go();
    })
    .catch((error) => {
      console.error("Error deleting email message:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      }
    });
}

function editEmail(emailMessageId) {
  console.log("Editing with emailMessageId: " + emailMessageId);
  router.push({
    name: "adminEmailEdit",
    params: { emailMessageId: emailMessageId },
  });
}
function addEmail() {
  router.push({ name: "adminEmailAdd" });
}
</script>

<template>
  <v-row class="pa-4 text-h5 font-weight-bold"> Manage Email Messages </v-row>

  <v-row>
    <v-spacer></v-spacer>
    <v-btn class="mr-4" color="#800000" style="float: right" @click="addEmail()"
      >New Email Message</v-btn
    >
  </v-row>
  <div class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Subject</th>
          <th class="text-left">Text</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>

      <tr v-for="(a, index) in emails" style="background-color: #d5dfe7">
        <td class="pa-4">{{ a.name }}</td>
        <td class="pa-4">{{ a.description }}</td>
        <td class="pa-4 fixcol">{{ a.text }}</td>

        <td>
          <v-btn
            class="mr-4"
            color="button_blue"
            style="float: right"
            @click="editEmail(a.emailMessageId)"
            >edit</v-btn
          >
        </td>
      </tr>
    </v-table>
  </div>
</template>
<style scoped>
td.fixcol {
  max-width: 300px !important;
}
</style>
