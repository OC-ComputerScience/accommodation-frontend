import apiClient from "./services";
var baseURL = "/emailMessage/";


export default {
    // Get all email messages
    getAll(){
        return apiClient.get(baseURL);
    },
    // Get a single email message by ID
    getOne(emailMessageId){
        return apiClient.get(baseURL + `${emailMessageId}`);
    },
    // Create a new email message
    create(data){
        return apiClient.post(baseURL, data);
    },
    // Update an existing email message by ID
    update(emailMessageId, data){
        return apiClient.put(baseURL + `${emailMessageId}`, data);
    },
    // Delete an email message by ID
    delete(emailMessageId){
        return apiClient.delete(baseURL + `${emailMessageId}`);
    },
    // Delete all email messages
    deleteAll(){
        return apiClient.delete(baseURL);
    }
};
