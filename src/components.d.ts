/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

import DatePicker from "vue-datepicker-next";
import FormCanButtonsVue from "@/components/form/FormCanButtons.vue";
import FormCheckboxVue from "./components/form/FormCheckbox.vue";
import FormInputVue from "./components/form/FormInput.vue";
import FormPickerVue from "./components/form/FormPicker.vue";
import FormSelectVue from "./components/form/FormSelect.vue";
import FormTabRowVue from "./components/form/FormTabRow.vue";
import FormTableActionsVue from "./components/form/FormTableActions.vue";
import FormTableHeaderVue from "./components/form/FormTableHeader.vue";
import FormToggleButtonsVue from "./components/form/FormToggleButtons.vue";
import PeriodDateVue from "./components/Period/PeriodDate.vue";
import BaseCardVue from "./components/BaseCard.vue";
import BaseBreadcrumbVue from "./components/BaseBreadcrumb.vue";
import FileUploadVue from "./components/form/FileUpload.vue";
import FilterPage from "./components/FilterPage.vue";
import UiParentCard from "./components/UiParentCard.vue";
import UserInfo from "./components/vSearchPerson/UserInfo.vue";
import SetPassportData from "./components/vSearchPerson/SetPassportData.vue";
import VSearchPerson from "./components/vSearchPerson/VSearchPerson.vue";
import FormTableVue from "./components/FormTables/FormTable.vue";

export {};

declare module "vue" {
  export interface GlobalComponents {
    /* FORM COMPONENTS */
    ["ui-parent-card"]: typeof UiParentCard;
    ["date-picker"]: typeof DatePicker;
    ["form-table"]: typeof FormTableVue;
    ["form-table-header"]: typeof FormTableHeaderVue;
    ["form-table-actions"]: typeof FormTableActionsVue;
    ["form-checkbox"]: typeof FormCheckboxVue;
    ["form-select"]: typeof FormSelectVue;
    ["form-input"]: typeof FormInputVue;
    ["form-picker"]: typeof FormPickerVue;
    ["form-tab-row"]: typeof FormTabRowVue;
    ["form-toggle-buttons"]: typeof FormToggleButtonsVue;
    ["form-can-buttons"]: typeof FormCanButtonsVue;
    ["filter-page"]: typeof FilterPage;
    ["file-upload"]: typeof FileUploadVue;

    ["set-passport-data"]: typeof SetPassportData;
    ["user-info"]: typeof UserInfo;
    ["v-search-oerson"]: typeof VSearchPerson;
    ["base-card"]: typeof BaseCardVue;
    ["base-bread-crumb"]: typeof BaseBreadcrumbVue;
  }
}
