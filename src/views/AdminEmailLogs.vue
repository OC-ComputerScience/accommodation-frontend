<template>
  <v-container>
    <v-card>
      <v-card-title>
        Email Logs
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-table>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" class="text-left">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in emailLogs" :key="item.emailLogId">
            <td>{{ item.emailLogId }}</td>
            <td>{{ formatDateTime(item.date) }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.senderEmail }}</td>
            <td>{{ item.toEmailAddress }}</td>
            <td>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <span v-bind="props" class="text-truncate d-inline-block" style="max-width: 200px">
                    {{ item.messageContent }}
                  </span>
                </template>
                <span>{{ item.messageContent }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import emailLogServices from '../services/emailLogServices';

const search = ref('');
const loading = ref(false);
const emailLogs = ref([]);

const headers = [
  { title: 'ID', key: 'emailLogId' },
  { title: 'Date', key: 'date' },
  { title: 'Category', key: 'category' },
  { title: 'From', key: 'senderEmail' },
  { title: 'To', key: 'toEmailAddress' },
  { title: 'Message', key: 'messageContent' }
];

const formatDateTime = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};

const fetchEmailLogs = async () => {
  loading.value = true;
  try {
    const response = await emailLogServices.getAllEmailLogs();
    emailLogs.value = response.data;
  } catch (error) {
    console.error('Error:', error);
  }
  loading.value = false;
};

onMounted(() => {
  fetchEmailLogs();
});
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-table {
  width: 100%;
}

thead th {
  font-weight: bold !important;
  background-color: #f5f5f5;
}

tbody tr:nth-child(even) {
  background-color: #fafafa;
}

td, th {
  padding: 12px !important;
}
</style>