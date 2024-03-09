<script setup>
import accomCatServices from "../services/accomCatServices";
import { ref, onMounted } from 'vue';
import accommodationServices from "../services/accommodationServices";
import router from '../router';

const accomCategory = ref([]);
const catNames = ref([]);

let textTitle = ref('');
let textDescription = ref('');
const select = ref(null);

const newAccomID = ref(null)
const currentFile = ref(undefined);
const fileChanged = ref(false)
const errorMessage = ref("");
const message = ref("")

async function getAccomCat(){
    try {
        const response = await accomCatServices.getAll();
        accomCategory.value = response.data;
        setCatNames();
    } catch (err) {
        console.log(err);
    }
}

function setCatNames(){
    catNames.value = accomCategory.value.map(item => item.name);
}

const uploadExplanationFile = async () => {
  errorMessage.value = ""
  if (!currentFile.value) {
    console.log("Please select a file!")
    message.value = "Please select a file!";
    return;
  }

  message.value = "";

  try {
    const response = await accommodationServices.uploadExplanationFile(newAccomID.value, currentFile.value);

    message.value = response.data.message;

  } catch (error) {
    console.log(error)
    if(error.request.status == 404) {
        errorMessage.value = "Accommodation not found!"
    } else {
        errorMessage.value = "An error occured when uploading the file!";
    }
    currentFile.value = undefined;
  }
};

async function save(){
    console.log(select.value)

    let accomData = {
        categoryName: select.value,
        title: textTitle.value,
        description: textDescription.value,
        explanationFile: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    console.log('accom: ', accomData)
    const response = await accommodationServices.create(accomData)
    newAccomID.value = response.data.accomId

    if(fileChanged.value == true){
        await uploadExplanationFile()
    }
    if(errorMessage)
    router.push({ name: 'adminViewAccom'});
}

function cancel(){
    router.push({ name: 'adminViewAccom'});
}

onMounted(async() =>{
    await getAccomCat();
}) 
</script>

<template>
    <div>
        <div class="text-h5" style="font-weight: bold;">Add New Accommodation</div>
    </div>

    <div class="pa-4">
        
        <v-card style="background-color:#D5DFE7" class="pa-4">
            <div>
                <p class="pl-5" style="font-weight: bold;">Category</p>
                <v-combobox v-if="accomCategory.length > 0" 
                    class="pl-5 pr-5"
                    :items="catNames"
                    label="select a category"
                    v-model="select"
                ></v-combobox>
                <p v-else>No categories...</p>
            </div>
            <div>
                <p class="pl-5" style="font-weight: bold;">Title</p>
                <v-text-field class="pl-5 pr-5" label="title of accommodation" v-model="textTitle"></v-text-field>
            </div>
            <div>
                <p class="pl-5" style="font-weight: bold;">Description</p>
                <v-text-field class="pl-5 pr-5" label="description of accommodation" v-model="textDescription"></v-text-field>
            </div>

            <div>
                <p class="pl-5" style="font-weight: bold;">Accommodation Explanation (Optional)</p>
                <v-file-input 
                    label="Explanation File" 
                    v-model="currentFile"
                    prepend-inner-icon="mdi-paperclip" 
                    prepend-icon="null" 
                    class="ml-n10 px-5"
                    :error-messages="errorMessage"
                    :messages="message"
                    @change="fileChanged = true"
                ></v-file-input>
            </div>
        </v-card>

        <div class="ma-6">
            <v-btn class="mr-4" color="button_blue" style="float:right" @click="save()">save</v-btn>
            <v-btn class="ml-4 mr-2" color="primary" style="float:right" @click="cancel()">cancel</v-btn>
            
        </div>
    </div>
</template>