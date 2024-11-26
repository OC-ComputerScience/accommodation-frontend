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
            <td>{{ getStudentName(item.studentId) }}</td>
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

      <v-card-text v-if="filteredLogs.length === 0" class="text-center">
        No matching records found
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import emailLogServices from '../services/emailLogServices';
import studentServices from '../services/studentServices';

const search = ref('');
const loading = ref(false);
const emailLogs = ref([]);
const students = ref(new Map()); // Cache for student data

const headers = [
  { title: 'ID', key: 'emailLogId' },
  { title: 'Date', key: 'date' },
  { title: 'Student', key: 'student' },
  { title: 'Category', key: 'category' },
  { title: 'From', key: 'senderEmail' },
  { title: 'To', key: 'toEmailAddress' },
  { title: 'Message', key: 'messageContent' }
];

const filteredLogs = computed(() => {
  if (!search.value) return emailLogs.value;
  
  const searchTerm = search.value.toLowerCase();
  return emailLogs.value.filter(log => {
    const studentName = getStudentName(log.studentId)?.toLowerCase();
    return (
      log.emailLogId.toString().includes(searchTerm) ||
      log.category?.toLowerCase().includes(searchTerm) ||
      log.senderEmail?.toLowerCase().includes(searchTerm) ||
      log.toEmailAddress?.toLowerCase().includes(searchTerm) ||
      log.messageContent?.toLowerCase().includes(searchTerm) ||
      studentName?.includes(searchTerm) ||
      (log.date && formatDateTime(log.date).toLowerCase().includes(searchTerm))
    );
  });
});

const formatDateTime = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};

const getStudentName = (studentId) => {
  return students.value.get(studentId) || 'Loading...';
};

const fetchStudentData = async (studentId) => {
  if (!students.value.has(studentId) && studentId) {
    try {
      const response = await studentServices.getOne(studentId); // Updated to use your service method
      const student = response.data;
      students.value.set(studentId, `${student.fName} ${student.lName}`);
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      students.value.set(studentId, 'Error loading student');
    }
  }
};

const fetchEmailLogs = async () => {
  loading.value = true;
  try {
    const response = await emailLogServices.getAllEmailLogs();
    emailLogs.value = response.data;
    // Fetch student data for all logs
    await Promise.all(
      emailLogs.value
        .map(log => log.studentId)
        .filter(id => id != null)
        .map(fetchStudentData)
    );
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

.v-table tr td {
  height: 48px;
}
</style>