<script setup>
    import AccommodationServices from "../services/accommodationServices.js";
    import accomCatServices from "../services/accomCatServices";
    import { ref, onMounted } from 'vue';
    import router from '../router';

    const accoms = ref([]);
    const cats = ref([]);
    const select = ref([]);


    async function getAccommodations(){
        try {
            const response = await AccommodationServices.getAll();
            accoms.value = response.data;
        } catch (err) {
            console.log(err);
        }
    }
    async function getAccomCats(){
        try {
            const response = await accomCatServices.getAll();
            cats.value = response.data;
            setCategories();
            setDefaultCatValues();
        } catch (err) {
            console.log(err)
        }
    }
    function setCategories(){
        const uniqueCategories = new Set(cats.value.map(item => item.name));
        cats.value = Array.from(uniqueCategories).map(name => ({ name }));
    }
    function setDefaultCatValues() {
        select.value = accoms.value.map((accom) => accom.categoryName);
    }
    onMounted(async() =>{
        await getAccommodations();
        await getAccomCats();
        setDefaultCatValues();
    })

    function save(a, index){
        let accomData = {
            categoryName: select.value[index]
        };
        AccommodationServices.update(a.accomId, accomData)
        this.router.go()
    }
    function deleteUser(id){
        AccommodationServices.delete(id)
        this.router.go()
    }
    function newAccom(){
        router.push({ name: 'adminAccomManage'});
    }
    function editAccom(x){
        router.push({ name: 'adminEditAccom', params: {accomID: x}});
    }
</script>

<template>
    <div>
        <div class="text-h5" style="font-weight: bold;">View Accommodations</div>
    </div>

    <div>
        <v-btn class="mr-4" color="#800000" style="float:right" @click="newAccom()">New Accommodation</v-btn>
    </div>

    <div class="pa-4">
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                        Title
                    </th>
                    <th class="text-left">
                        Description
                    </th>
                    <th class="text-left">
                        Category
                    </th>
                </tr>
            </thead>
        
            <tr v-for="(a, index) in accoms" style="background-color: #D5DFE7;">
                <td class="pa-4">{{ a.title }}</td>
                <td>{{ a.description }}</td>
                <td>
                    <v-combobox
                        :items="cats.map(cat => cat.name)"
                        label="category"
                        v-model="select[index]"
                    ></v-combobox>
                </td>
                <td class="pa-4">
                    <v-btn class="mr-4" color="error" style="float:right" @click="deleteUser(a.accomId)">delete</v-btn>
                    <v-btn class="mr-4" color="#F9C634" style="float:right" @click="save(a, index)">save</v-btn>
                    <v-btn class="mr-4" color="black" style="float:right" @click="editAccom(a.accomId)">edit</v-btn>

                </td>
            </tr>
        </v-table>
    </div>
    
</template>