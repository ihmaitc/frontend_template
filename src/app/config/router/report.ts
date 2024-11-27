export default [
  {
    path: "/report/GetSurveyReportByPublic",
    name: "GetSurveyReportByPublic",
    component: () => import("@/views/report/GetSurveyReportByPublic.vue"),
    meta: {
      pageTitle: "GetSurveyReportByPublic",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "GetSurveyReportByPublic",
          active: true
        }
      ]
    }
  }
];
