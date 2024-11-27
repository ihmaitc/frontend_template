<script setup lang="ts">
import { SubmitEventPromise } from "vuetify";
import { SERIES_LIST } from "@/utils/constants";
import { IPerson, ISelectList } from "@/models/basic";
import { reactive, ref, toRefs } from "vue";
import { ISetPassportData, INotHasDoc } from "./types";
import { watch } from "vue";
import { computed } from "vue";
import { UserPlusIcon } from "vue-tabler-icons";

interface IProps {
  documentTypeList?: ISelectList[];
  genderList?: ISelectList[];
  person?: IPerson | null;
  searchLading: boolean;
  clear?: boolean | number;
  isDocumentType?: boolean;
  excludeDocumentTypes?: number[];
}

const props = withDefaults(defineProps<IProps>(), {
  isDocumentType: true
});

const emits = defineEmits<{
  (e: "setPerson", value: ISetPassportData): void;
  (e: "addPerson", value: INotHasDoc): void;
}>();

const { person } = toRefs(props);

const getDocumentTypeList = computed(() => {
  let newDocuments = props.documentTypeList || [];
  if (props.excludeDocumentTypes && props.documentTypeList) {
    // newDocuments = props.documentTypeList.filter((el) => !props.excludeDocumentTypes?.includes(el.value));
  }
  return newDocuments;
});

const innerPerson = ref<INotHasDoc>({
  birthOn: "",
  genderName: "",
  firstName: "",
  genderId: null,
  documentTypeId: null,
  lastName: "",
  middleName: ""
});

const filterPerson = reactive<ISetPassportData>({
  documentTypeId: null,
  seria: "",
  number: null,
  dateOfBirth: "",
  pinfl: ""
});

const uploadFilterFromPerson = () => {
  if (person.value) {
    filterPerson.dateOfBirth = person.value.birthOn;
    filterPerson.documentTypeId = person.value.documentTypeId;
    filterPerson.number = person.value.docNumber;
    filterPerson.seria = person.value.docSeria;
  }
};

const sortedSeriaList = computed(() => {
  return SERIES_LIST.sort(function (a, b) {
    return a.id - b.id || a.text.localeCompare(b.text);
  });
});

const clearData = () => {
  filterPerson.documentTypeId = null;
  filterPerson.dateOfBirth = "";
  filterPerson.number = "";
  filterPerson.seria = "";
};

const searchPerson = async (values: SubmitEventPromise) => {
  const { valid } = await values;
  if (valid) {
    if (filterPerson.documentTypeId && [4].includes(filterPerson.documentTypeId)) {
      innerPerson.value.documentTypeId = filterPerson.documentTypeId;

      emits("addPerson", innerPerson.value);
      return;
    }
    emits("setPerson", filterPerson);
  }
};

uploadFilterFromPerson();

watch(
  () => [props.clear, props.isDocumentType],
  (value) => {
    if (value[0]) {
      clearData();
    }

    if (!value[1]) {
      delete filterPerson["documentTypeId"];
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-form @submit.prevent="searchPerson">
    <v-row class="align-center">
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0" v-if="isDocumentType">
        <form-select
          :list="getDocumentTypeList"
          v-model="filterPerson.documentTypeId"
          :label="$t('passportParams.documentType')"
          required
          :disabled="searchLading"
          :noSearch="true"
          style="z-index: 2500"
        />
      </v-col>
      <template v-if="!filterPerson.documentTypeId || (filterPerson.documentTypeId && ![4, 6].includes(filterPerson.documentTypeId))">
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 1">
          <form-select
            :list="sortedSeriaList"
            v-model="filterPerson.seria"
            :label="$t('passportParams.docSeries')"
            :disabled="searchLading"
            required
          />
        </v-col>
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-else-if="filterPerson.documentTypeId != 7">
          <form-input v-model="filterPerson.seria" :label="$t('passportParams.docSeries')" :disabled="searchLading" required mask="AA" />
        </v-col>
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId != 7">
          <form-input
            v-model="filterPerson.number"
            :label="$t('passportParams.documentNumber')"
            placeholder="#######"
            :mask="filterPerson.documentTypeId == 1 || filterPerson.documentTypeId == 3 ? '########' : '#######'"
            required
            :canAddZero="true"
            :disabled="searchLading"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
          <form-picker
            class="w-100"
            v-model:model-value="filterPerson.dateOfBirth"
            :label="$t('passportParams.birthOn')"
            required
            :disabled="searchLading"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 3 || filterPerson.documentTypeId == 7">
          <form-input
            class="w-100"
            v-model:model-value="filterPerson.pinfl"
            mask="##############"
            :label="$t('passportParams.pinfl')"
            required
            :disabled="searchLading"
          />
        </v-col>
        <slot name="customFilter"></slot>
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
          <v-btn
            color="success"
            size="large"
            type="submit"
            prepend-icon="mdi-account-search"
            :loading="searchLading"
            @click="searchPerson"
            variant="flat"
          >
            {{ $t("passportParams.Search") }}
          </v-btn>
        </v-col>
      </template>
      <template v-if="filterPerson.documentTypeId && [4].includes(filterPerson.documentTypeId)">
        <v-col cols="12" lg="3" md="6" class="py-0">
          <form-input v-model="innerPerson.lastName" :label="$t('lastName')" required />
        </v-col>
        <v-col cols="12" lg="3" md="6" class="py-0">
          <form-input v-model="innerPerson.firstName" :label="$t('firstName')" required />
        </v-col>
        <v-col cols="12" lg="3" md="6" class="py-0">
          <form-input v-model="innerPerson.middleName" :label="$t('middleName')" required />
        </v-col>
        <v-col cols="12" lg="3" md="6" class="py-0">
          <form-picker noSearch v-model="innerPerson.birthOn" mask="##.##.####" :label="$t('birthOn')" required />
        </v-col>
        <v-col cols="12" lg="3" md="6" class="py-0">
          <form-select noSearch :list="genderList" v-model="innerPerson.genderId" :label="$t('gender')" required />
        </v-col>
        <v-col cols="12" lg="3" md="6" class="py-0">
          <v-btn color="violet" size="large" @click="searchPerson" type="submit">
            <UserPlusIcon size="20" class="mr-2" />
            {{ $t("AddRow") }}
          </v-btn>
        </v-col>
      </template>
      <template v-if="filterPerson.documentTypeId && [6].includes(filterPerson.documentTypeId)">
        <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
          <form-input
            class="w-100"
            v-model:model-value="filterPerson.pinfl"
            mask="##############"
            :label="$t('passportParams.pinfl')"
            required
            :disabled="searchLading"
          />
        </v-col>

        <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
          <v-btn
            color="success"
            size="large"
            type="submit"
            prepend-icon="mdi-account-search"
            :loading="searchLading"
            @click="searchPerson"
            variant="flat"
          >
            {{ $t("passportParams.Search") }}
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </v-form>
</template>
