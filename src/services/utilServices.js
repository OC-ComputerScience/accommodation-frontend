import apiClient from "./services";
var baseURL = "/utils/";

const emailCategory = (data) => {
  return http.post(
    "/accommodations-t4/accommodationsAdmin/sendCategoryEmail",
    data
  );
};

export default {
  emailCategory,

  emailCategoryTemplate(data) {
    // Remove duplicates from accomCatIds
    data.accomCatIds = [...new Set(data.accomCatIds)];
    console.log(data);
    return apiClient.post(baseURL + `emailChapel`, data);
  },
  emailFaculty(data) {
    return apiClient.post(baseURL + `emailFaculty`, data); // 🟢 Change here
  },
};
