<script setup>
import AccommodationServices from "../services/accommodationServices.js";
import accomCatServices from "../services/accomCatServices";
import { ref, onMounted } from 'vue';
import router from '../router';
import accommodationServices from "../services/accommodationServices.js";

const newAccom = ref({});

const props = defineProps({
    accomID: {
        required: true,
    }
});

const accom = ref([]);
const accoms = ref([]);
const editedAccom = ref([]);
const cats = ref([]);
const select = ref(null);

const currentFile = ref(undefined);
const fileChanged = ref(false)
const errorMessage = ref("");
const message = ref("")


async function getAccomCats(){
    try {
        const response = await accomCatServices.getAll();
        cats.value = response.data;
        setCategories();
    } catch (err) {
        console.log(err)
    }
}

function setCategories(){
    const uniqueCategories = new Set(cats.value.map(item => item.name));
    cats.value = Array.from(uniqueCategories).map(name => ({ name }));
}

function setDefaultCatValues() {
    select.value = accom.value.map((accom) => accom.categoryName);
}

async function getAccom(){
    try {
        const response = await AccommodationServices.getOne(props.accomID);
        newAccom.value = response.data;
        currentFile.value = [new File([], newAccom.value.explanationFile || "N/A")]
    } catch (err) {
        console.log(err);
    }
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
    const response = await AccommodationServices.uploadExplanationFile(props.accomID, currentFile.value);

    message.value = response.data.message;

  } catch (error) {
    if(error.request.status == 404) {
        errorMessage.value = "Accommodation not found!"
    } else {
        errorMessage.value = "An error occured when uploading the file!";
    }
    currentFile.value = undefined;
  }
};

onMounted(async() =>{
    await getAccom();
    await getAccomCats();
    setDefaultCatValues();
})


async function save() {
    await accommodationServices.update(props.accomID, newAccom.value);

    if(fileChanged.value == true){
        await uploadExplanationFile()
    }
    if(errorMessage.value == ""){
        router.push({ name: "adminViewAccom" });
    }
    
}

function cancel(){
    router.push({ name: "adminViewAccom" });

}

</script>

<template>
    <div>
        <div>
            <div class="text-h5" style="font-weight: bold;">Edit Accommodation</div>
        </div>

        <div class="pa-4">
            
            <v-card style="background-color:#D5DFE7" class="pa-4">
                <div>
                    <p class="pl-5" style="font-weight: bold;">Accommodation Title</p>
                    <v-text-field class="px-5" v-model ="newAccom.title" v-bind="editedAccom"></v-text-field>
                </div>
                <div>
                    <p class="pl-5" style="font-weight: bold;">Accommodation Description</p>
                    <v-text-field  class="px-5" v-model ="newAccom.description" v-bind="editedAccom"></v-text-field>
                </div>
                <div>
                    <p class="pl-5" style="font-weight: bold;">Accommodation Category</p>
                        <v-select class="px-5"
                                :items="cats.map(cat => cat.name)"
                                label="category"
                                v-model="newAccom.categoryName"
                            ></v-select>
                </div>
                <div>
                    <p class="pl-5" style="font-weight: bold;">Accommodation Explanation</p>
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
                <v-btn class="ml-4" style="float:right" @click="cancel()">cancel</v-btn>
                <v-btn class="mr-4" color="#F9C634" style="float:right" @click="save()">save</v-btn>
            </div>
        </div>
    </div>
</template>