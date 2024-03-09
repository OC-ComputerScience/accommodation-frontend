import apiClient from "./services";
import axios from "axios"
var baseURL = "/accommodation/";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    getById(accomId){
        return apiClient.get(baseURL + accomId);
    },
    getAllForCategory(categoryName){
        return apiClient.get(baseURL + `category/${categoryName}`);
    },
    getOne(accommID){
        return apiClient.get(baseURL + `${accommID}`);
    },
    create(data){
        return apiClient.post(baseURL, data);
    },
    update(accommId, data){
        return apiClient.put(baseURL + `${accommId}`, data);
    },
    delete(accommId){
        console.log('deleting');
        return apiClient.delete(baseURL+`${accommId}`);
    },
    uploadExplanationFile(accomId, file, onProgressCallback){
        let formData = new FormData();

        formData.append("file", file[0]);
        return axios.post('http://localhost:3024/accommodations-t4'+ baseURL + `${accomId}/explanationFile`, formData, {}, onProgressCallback)
    }
};