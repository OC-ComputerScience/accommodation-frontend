import apiClient from "./services";
const baseURL = "/emailLog";

export default {
    getAllEmailLogs(filters = {}) {
        console.log("Request URL:", baseURL);
        // Add query parameters for filters
        const params = new URLSearchParams();
        if (filters.studentId) params.append('studentId', filters.studentId);
        if (filters.category) params.append('category', filters.category);
        if (filters.emailLogId) params.append('emailLogId', filters.emailLogId);

        const url = params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
        return apiClient.get(url);
    },
    
    getOneEmailLog(emailLogId) {
        return apiClient.get(`${baseURL}/${emailLogId}`);
    },
    
    createEmailLog(data) {
        const emailLogData = {
            toEmailAddress: data.toEmailAddress,
            category: data.category || 'General',
            studentId: data.studentId,
            senderEmail: data.senderEmail,
            messageContent: data.messageContent
            // date will be set by backend
        };
        return apiClient.post(baseURL, emailLogData);
    },
    
    updateEmailLog(emailLogId, data) {
        const updateData = {
            toEmailAddress: data.toEmailAddress,
            category: data.category,
            studentId: data.studentId,
            senderEmail: data.senderEmail,
            messageContent: data.messageContent
        };
        return apiClient.put(`${baseURL}/${emailLogId}`, updateData);
    },
    
    // Filter emails by student
    getEmailLogsByStudent(studentId) {
        return this.getAllEmailLogs({ studentId });
    },

    // Filter emails by category
    getEmailLogsByCategory(category) {
        return this.getAllEmailLogs({ category });
    },
    
    deleteEmailLog(emailLogId) {
        return apiClient.delete(`${baseURL}/${emailLogId}`);
    }
};