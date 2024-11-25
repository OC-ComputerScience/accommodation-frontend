import { createRouter, createWebHistory } from "vue-router";

// Import views
import Login from "./views/Login.vue";
//import RequestForm from "./views/RequestForm.vue";

import AdminHome from "./views/AdminHome.vue";
import StudentHome from "./views/StudentHome.vue";
import AdminAdd from "./views/AdminAdd.vue"
import AdminAccomManage from "./views/AdminAccomManage.vue"
import AdminCatManage from "./views/AdminCatManage.vue"
import AdminCatEdit from "./views/AdminCatEdit.vue"
import AdminCatAdd from "./views/AdminCatAdd.vue"
import AdminUserManage from "./views/AdminUserManage.vue"
import AdminViewAccom from "./views/AdminViewAccom.vue"
import AdminStudentAccom from "./views/AdminStudentAccom.vue"
import AdminEmailManage from "./views/AdminEmailManage.vue"
import AdminEmailAdd from "./views/AdminEmailAdd.vue"
import AdminEmailEdit from "./views/AdminEmailEdit.vue"
import AdminEditAccom from "./views/AdminEditAccom.vue"
import AdminSemManage from "./views/AdminSemManage.vue"
import AdminSemEdit from "./views/AdminSemEdit.vue"
import AdminSemAdd from "./views/AdminSemAdd.vue"
import AdminEmailLogs from "./views/AdminEmailLogs.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/student",
      name: 'studentHome',
      component: StudentHome,
    },
    {
      path: "/admin",
      name: "adminHome",
      component: AdminHome,
    },
    {
      // :id is the id of the request which is being added to 
      path: '/admin/adminAdd/:id',
      name: 'adminAdd',
      component: AdminAdd,
      // props: {route} => {{ request: route.request.requestId}}
    },
    {
      path: '/admin/adminAccomManage/',
      name: 'adminAccomManage',
      component: AdminAccomManage,
    },
    {
      path: '/admin/adminCatManage/',
      name: 'adminCatManage',
      component: AdminCatManage,
    },
    {
      path: '/admin/adminSemManage/',
      name: 'adminSemManage',
      component: AdminSemManage,
    },
    {
      path: '/admin/adminEmailManage/',
      name: 'adminEmailManage',
      component: AdminEmailManage,
    },
    {
      path: '/admin/adminEmailAdd/',
      name: 'adminEmailAdd',
      component: AdminEmailAdd,
    },
    {
      path: '/admin/adminEmailEdit/:emailMessageId',
      name: 'adminEmailEdit',
      component: AdminEmailEdit,
      props: true,
    },
    {
      path: '/adminCatEdit/:accomCatId',
      name: 'adminCatEdit',
      component: AdminCatEdit,
      props: true,
    },
    {
      path: '/adminCatAdd/',
      name: 'adminCatAdd',
      component: AdminCatAdd,
    },
    {
      path: '/adminSemEdit/:semesterId',
      name: 'adminSemEdit',
      component: AdminSemEdit,
      props: true,
    },
    {
      path: '/adminSemAdd/',
      name: 'adminSemAdd',
      component: AdminSemAdd,
    },
    {
      path: '/admin/adminUserManage/',
      name: 'adminUserManage',
      component: AdminUserManage,
    },
    {
      path: '/admin/adminViewAccom/',
      name: 'adminViewAccom',
      component: AdminViewAccom,
    },
    {
      path: '/admin/adminStudentAccom/',
      name: 'adminStudentAccom',
      component: AdminStudentAccom,
    },
    
  
    {
      path: "/StudentHome/:studentId",
      name: "StudentHome",
      component: StudentHome,
      props: true,
    },
    {
      path: '/adminEditAccom/:accomID',
      name: 'adminEditAccom',
      component: AdminEditAccom,
      props: true,
    },
    {
      path: '/admin/email-logs', 
      name: 'adminEmailLogs',
      component: AdminEmailLogs,
    },
   
  ],
});

export default router;
