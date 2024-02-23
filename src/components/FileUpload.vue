<script setup>
import { ref, onMounted } from "vue"
import AccommodationServices from "../services/accommodationServices.js";

const props = defineProps({
    accommId: {
        type: Number,
        required: true
    },
    isAdd: {
        type: Boolean,
        default: false
    }
})

const accommodation = ref({
    explanationFile: "None"
})

const currentFile = ref(undefined);
const progress = ref(0);
const errorMessage = ref("");
const message = ref("")
const fileInfos = ref([]);

const showUpdate = ref(false)
const infoLoading = ref(true)

const selectFile = (file) => {
    console.log(file)
  progress.value = 0;
  currentFile.value = file;
};

const upload = async () => {
  if (!currentFile.value) {
    console.log("Please select a file!")
    message.value = "Please select a file!";
    return;
  }

  message.value = "";

  try {
    const response = await AccommodationServices.uploadExplanationFile(props.accommId, currentFile.value, (event) => {
      progress.value = Math.round((100 * event.loaded) / event.total);
    });

    message.value = response.data.message;

    // const files = await UploadService.getFiles();
    // fileInfos.value = files.data;
  } catch (error) {
    progress.value = 0;
    if(error.request.status == 404) {
        errorMessagemessage.value = "Accommodation not found!"
    } else {
        errorMessage.value = "An error occured when uploading the file!";
    }
    currentFile.value = undefined;
  }
};

const getAccommodation = () => {
    if(!props.isAdd) {
        AccommodationServices.getById(props.accommId)
        .then((response) => {
            accommodation.value = response.data
            currentFile.value = new File([], accommodation.value.explanationFile)
            infoLoading.value = false
        })
    } else {
        infoLoading.value = false
    }
}

onMounted(() => {
  getAccommodation()
});
</script>

<template>
    <div v-if="!infoLoading">
        <v-row v-if="!showUpdate" class="align-center mb-2" no-gutters>
            <v-text-field 
                label="Explanation File" 
                v-model="accommodation.explanationFile"
                readonly 
                hide-details
            />
            <v-btn
                class="ml-2" 
                color="button_blue"
                @click="showUpdate = true"
            > {{props.isAdd ? 'Add ' : 'Update'}} </v-btn>
        </v-row>
        <v-row v-else class="align-center" no-gutters>
            <v-file-input 
                :label="(props.isAdd ? 'Add' : 'New') + ' Explanation File'" 
                v-model="currentFile"
                prepend-inner-icon="mdi-paperclip" 
                prepend-icon="null" 
                class="ml-n10"
                :error-messages="errorMessage"
                :messages="message"
            ></v-file-input>
            <v-btn class="mb-5 ml-2" color="button_blue" @click="upload()"> Upload </v-btn>
        </v-row>
    </div>
</template>
