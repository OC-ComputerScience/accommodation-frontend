import apiClient from "./services";
var baseURL = "/utils/";


const emailCategory = (data) => {
    return http.post("/accommodations-t4/accommodationsAdmin/sendCategoryEmail", data);
  };


export default {
  emailCategory,

    emailChapel(data) {
        return apiClient.post(baseURL + `emailChapel`, data); // 🟢 Change here
      },
      emailFaculty(data) {
        return apiClient.post(baseURL + `emailFaculty`, data); // 🟢 Change here
      }
};


  


  


  
 