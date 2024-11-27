<script setup lang="ts">
import { IPerson, ISelectList } from "@/models/basic";
import { computed, nextTick, ref, toRefs, watch } from "vue";
import SetPassportData from "./SetPassportData.vue";
import UserInfo from "./UserInfo.vue";
import { IPassportIncludes, ISetPassportData } from "./types";
import PersonService from "@/services/others/person.service";
import { BASE64STRING } from "@/utils/constants";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

interface IProps {
  documentTypeList?: ISelectList[];
  excludeDocumentTypes?: number[];
  modelValue: IPerson | null;
  image?: string;
  includes?: IPassportIncludes;
  requestToPerson?: boolean;
  canSearch?: boolean;
  hasMore?: boolean;
  checkBeforeSearch?: Function;
}

const props = withDefaults(defineProps<IProps>(), {
  canSearch: true,
  hasMore: true
});

const { includes, modelValue, requestToPerson } = toRefs(props);

const emits = defineEmits(["update:modelValue", "beforeSearchPerson", "setPerson"]);
const { setError } = useErrorToast();

/* variables */
const imagePhoto = ref("");
const isMoreLoading = ref(false);
const loading = ref(false);

const innerIncludes = ref<IPassportIncludes>({
  includePhoto: true,
  includeAddress: true,
  ...includes.value
});

const personFilter = ref<ISetPassportData>({
  dateOfBirth: "",
  documentTypeId: null,
  number: null,
  seria: "",
  pinfl: ""
});

/* computed */
const person = computed({
  get() {
    return modelValue.value;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  }
});

/* actions */

const fetchToPerson = () => {
  if (person.value) {
    const filter: ISetPassportData = {
      dateOfBirth: person.value?.birthOn,
      documentTypeId: person.value?.documentTypeId,
      number: person.value?.docNumber,
      seria: person.value?.docSeria,
      pinfl: ""
    };

    personFilter.value = filter;

    fetchPerson(filter);
  }
};

const fetchPerson = (values: ISetPassportData) => {
  personFilter.value = values;
  innerIncludes.value = {
    includePhoto: true,
    includeAddress: true,
    ...includes.value
  };
  emits("beforeSearchPerson", {
    filter: personFilter.value,
    person: person.value
  });
  const result =
    props.checkBeforeSearch &&
    props.checkBeforeSearch({
      filter: personFilter.value,
      person: person.value
    });

  if (result) {
    return;
  }
  searchPerson();
};

const searchPerson = () => {
  loading.value = true;

  PersonService.GetByPassportData({
    ...personFilter.value,
    ...innerIncludes.value
  })
    .then((res) => {
      person.value = res.data;
      imagePhoto.value = BASE64STRING + res.data.photo;
      if (person.value) {
        person.value.photo = null;
      }
      emits("setPerson", res.data);
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
      isMoreLoading.value = false;
    });
};

const handleIsMore = () => {
  innerIncludes.value = {
    ...innerIncludes.value,
    ...includes.value,
    includePension: true
  };

  isMoreLoading.value = true;
  searchPerson();
};

const unWatch = watch(
  () => person.value?.id,
  async (val) => {
    await nextTick();
    if (val && requestToPerson.value) {
      fetchToPerson();
      unWatch();
    }
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div>
    <slot v-if="canSearch" name="search" :fetchPerson="fetchPerson" :loading="loading" :person="person">
      <SetPassportData
        :searchLading="loading"
        :person="person"
        @set-person="fetchPerson"
        :documentTypeList="documentTypeList"
        :excludeDocumentTypes="excludeDocumentTypes"
      />
    </slot>

    <slot name="additional-info"></slot>

    <slot name="info" v-if="person && person.fullName">
      <UserInfo
        :person="person"
        :image="imagePhoto || image"
        :no-photo="!imagePhoto && !image"
        :isMoreLoading="isMoreLoading"
        :includes="innerIncludes"
        :hasMore="hasMore"
        @handleIsMore="handleIsMore"
      >
        <template v-for="(_, name) in ($slots as {})" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}" />
        </template>
      </UserInfo>
    </slot>
  </div>
</template>

<style lang="scss" scoped></style>
