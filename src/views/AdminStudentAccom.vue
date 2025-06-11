<script setup>
    import StudentAccomServices from "../services/studentAccomServices";
    import { ref, onMounted, computed, watch } from 'vue';
    import SemesterServices from "../services/semesterServices";

    const filterType = ref(null);
    const searchValue = ref(null);
    const studentAccom = ref([]);
    const tableData = ref([]);
    const noDataMsg = ref(null);
    const showTable = ref(false);
    const showEmpty = ref(false);
    const semesters = ref([]);



    const findAccommodations = async () => {
        tableData.value = [];
        showTable.value = false;
        showEmpty.value = false;
        if(filterType.value == "Student ID"){ //find by student
            await StudentAccomServices.getAllForStudent(searchValue.value)
                .then((response) => {
                    studentAccom.value = response.data;
                })
                .catch((err) => {
                    if(err.response && err.response.status === 404){
                        noDataMsg.value = `No data found for student with ID ${searchValue.value}`;
                        studentAccom.value = [];
                    } 
                });
        }
        else if(filterType.value == "Semester") { //find by semester
            const semesterId = selectedSemesterId.value;
            console.log("Passing semesterId: " + semesterId + "to student accom services")
            await StudentAccomServices.getAllForSemester(semesterId)
                .then((response) => {
                    studentAccom.value = response.data;
                })
                .catch((err) => {
                    if(err.response && err.response.status === 404){
                        noDataMsg.value = `No data found for Semester ${searchValue.value.title}`;
                        studentAccom.value = [];
                    }
                });
        } else return;
        //loop through studentAccom to parse data and put in array
        studentAccom.value.forEach((currentValue) => {
            const student = currentValue.student;
            const semester = currentValue.semester;
            const accommodation = currentValue.accommodation;

            console.log(currentValue);

            var semesterSeason = "";
            var semesterYear = "";
            //console.log(semester.semester);
            for (let i = 0; i < semester.semester.length; i++) {
             
                if (i < 2)
               {
                semesterSeason += semester.semester[i];                        //Adds the two letters in the year 
               }
               else
               {
                semesterYear += semester.semester[i];                          //Adds the four digits in the year
               }
            }   

            let bridge = {
                uName: student.fName + ' ' + student.lName,
                id: student.studentId,
                semester: semesterSeason + ' ' + semesterYear,
                type: accommodation.title,
                category: accommodation.categoryName
            };
            tableData.value.push(bridge);
        });
        if(studentAccom.value.length < 1){
            showEmpty.value = true;
            showTable.value = false;
            tableData.value = [];
        }
        else {
            showTable.value = true;
            showEmpty.value = false;
            noDataMsg.value = null;
        }
    }
    const retrieveSemesters = async () => {
  try {
    const response = await SemesterServices.getAllSemesters();
    semesters.value = response.data.map((semester) => ({
      title: semester.semester,
      key: semester.semesterId,
    }));
  } catch (error) {
    console.error("Error loading semesters:", error);
  }
};

const selectedSemesterId = computed(() => {
    return searchValue.value ? searchValue.value.key : null;
});

watch(filterType, (newFilterType) => {
    if (newFilterType === 'Student ID') {
        searchValue.value = '';
    } else if (newFilterType === 'Semester') {
        searchValue.value = null; // Reset to null or an appropriate default value for the semester filter
    }
});

onMounted(async () => {
  await retrieveSemesters();
});

</script>
<template>
    <div>
        <div class="text-h5" style="font-weight: bold;">View Student Accommodations</div>
        <div class pa-4>
            <v-card style="background-color:#D5DFE7" class="pa-4">
                <div>
                <v-combobox
                        v-model="filterType"
                        label="Select Filter"
                        :items="['Student ID', 'Semester']"
                        style="width:15rem"
                ></v-combobox>
                <p v-if="filterType">{{ filterType }}</p>
                    <v-text-field v-if="filterType=='Student ID'"
                        v-model="searchValue"
                        style="width: 20rem"
                    ></v-text-field>
                    <v-combobox
                        v-if="filterType=='Semester'"
                        v-model="searchValue"
                        :items="semesters"
                        item-text="title"
                        item-value="key"
                        style="width:15rem"
                    ></v-combobox>
                    <v-btn 
                        variant="elevated"
                        @click="findAccommodations()"
                        rounded="lg"
                        style="background-color: #118ACB;
                            color: white"
                    >
                        Find Accommodations
                    </v-btn>
                </div>
                <div class="ma-4">
                    <p v-if="noDataMsg">{{ noDataMsg }}</p>
                    <v-table
                    v-if="tableData.length > 0"
                    fixed-header
                    height = "20%"
                    >
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Semester</th>
                        <th>Accommodation</th> 
                        <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="data in tableData"
                        :key="data.studentId">
                        <td>{{ data.uName }}</td>
                        <td>{{ data.id }}</td>
                        <td>{{ data.semester }}</td>
                        <td>{{ data.type }}</td>
                        <td>{{ data.category }}</td>
                        </tr>
                    </tbody>
                    </v-table>

                </div>
            </v-card>
            <div v-if="showEmpty" class="ma-6 text-center">
                Sorry, we couldn't find any student accommodations for "{{ searchValue.title ? searchValue.title : searchValue }}". Please adjust the filters and try again.
            </div>

        </div>
    </div>
</template>