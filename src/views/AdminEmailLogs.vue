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
          <tr v-for="item in filteredLogs" :key="item.emailLogId">
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

      <!-- No results message -->
      <v-card-text v-if="filteredLogs.length === 0" class="text-center">
        No matching records found
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

// Computed property for filtered logs
const filteredLogs = computed(() => {
  if (!search.value) return emailLogs.value;
  
  const searchTerm = search.value.toLowerCase();
  return emailLogs.value.filter(log => {
    return (
      log.emailLogId.toString().includes(searchTerm) ||
      log.category?.toLowerCase().includes(searchTerm) ||
      log.senderEmail?.toLowerCase().includes(searchTerm) ||
      log.toEmailAddress?.toLowerCase().includes(searchTerm) ||
      log.messageContent?.toLowerCase().includes(searchTerm) ||
      (log.date && formatDateTime(log.date).toLowerCase().includes(searchTerm))
    );
  });
});

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

tbody tr:hover {
  background-color: #f0f0f0;
}

td, th {
  padding: 12px !important;
}

/* Loading state styles */
.v-table tr td {
  height: 48px;
}
</style>