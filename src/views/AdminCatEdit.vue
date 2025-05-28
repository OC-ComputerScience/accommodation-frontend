<script setup>
    import accomCatServices from "../services/accomCatServices";
    import { ref, onMounted, defineProps } from 'vue';
    import router from '../router';

    const props = defineProps({
        accomCatId: {
            required: true,
        },
        
    });
  
    let catName = ref('');
    let catEmail = ref('');

    onMounted(async () => {
    const accomCat = await accomCatServices.getOne(props.accomCatId);
    catName.value = accomCat.data.name;
    catEmail.value = accomCat.data.email;
});

    function save(){
       
        let catData = {
            name: catName.value,
            email: catEmail.value,
        };
        
        accomCatServices.update(props.accomCatId, catData);
        router.push({ name: 'adminCatManage'});
    }

    function cancel(){
        router.push({ name: 'adminCatManage'});
    }
</script>

<template>
    <div>
        <v-title class="text-h5" style="font-weight: bold;">Edit Category</v-title>
    </div>

    <div class="pa-4">
        
        <v-card style="background-color:#D5DFE7" class="pa-4">
           
            <div>
                <p class="pl-5" style="font-weight: bold;">Category Name</p>
                <v-text-field class="pl-5 pr-5" label= "" v-model="catName" ></v-text-field>
                <p class="pl-5" style="font-weight: bold;">Category Email</p>
                <v-text-field class="pl-5 pr-5" label= "" v-model="catEmail" ></v-text-field>
            </div>
            
        </v-card>

        <div class="ma-6">
            <v-btn class="ml-4" color="primary" style="float:right" @click="cancel()">cancel</v-btn>
            <v-btn class="mr-4" color="button_blue" style="float:right" @click="save()">save</v-btn>
        </div>
    </div>
</template>
