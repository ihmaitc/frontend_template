<script setup lang="ts">
import type { IPerson } from "@/models/basic";
import { IPassportIncludes } from "./types";
import { ref, toRefs } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import { ChevronDownIcon, ChevronUpIcon } from "vue-tabler-icons";

interface IProps {
  person?: IPerson | undefined | null;
  includes?: IPassportIncludes;
  image?: string;
  hasMore?: boolean;
  isMoreLoading?: boolean;
  noPhoto?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  hasMore: true
});

const emits = defineEmits(["handleIsMore"]);

const { person } = toRefs(props);
const isMore = ref(false);
const firstClick = ref(false);
const { parseNumber } = useGlobal();

const handleIsMore = () => {
  isMore.value = !isMore.value;

  if (isMore.value && !firstClick.value) {
    emits("handleIsMore");
  }
  firstClick.value = true;
};
</script>

<template>
  <div v-if="person" class="person-data my-8">
    <VCard class="border pa-0" elevation="0" v-if="person">
      <v-card-text class="pa-2">
        <v-row class="mt-0">
          <v-col lg="3" cols="12" v-if="image">
            <slot name="image">
              <VImg
                v-if="!noPhoto"
                :class="{
                  isDeath: person.isDeath
                }"
                class="shadow"
                rounded="sm"
                width="150"
                :src="image"
                color="background"
              ></VImg>
              <VImg
                v-else
                :class="{
                  isDeath: person.isDeath
                }"
                class="shadow"
                rounded="sm"
                width="150"
                height="192"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68D1zB62HiAWZAkQpessCgGpmfvJQUX8Rhg&s"
                color="background"
              ></VImg>
            </slot>
          </v-col>
          <v-col :lg="image ? 9 : 12" class="pl-0">
            <div class="user-list">
              <span class="text-subtitle-2"> {{ $t("passportData.fullName") }} </span>
              <slot name="fullName" :item="person">
                <span class="font-weight-bold text-subtitle-1 mx-2xl-auto text-center"> {{ person.fullName }}</span>
              </slot>
            </div>
            <v-row>
              <v-col cols="12">
                <div class="user-list half-col">
                  <span class="text-subtitle-2"> {{ $t("passportData.birthOn") }} </span>
                  <slot name="birthOn" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.birthOn }}</span>
                  </slot>
                  <span class="text-subtitle-2"> {{ $t("passportData.nationalityName") }} </span>
                  <slot name="nationalityName" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.nationalityName }}</span>
                  </slot>
                  <span class="text-subtitle-2"> {{ $t("passportData.docIssueOn") }} </span>
                  <slot name="docIssueOn" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.docIssueOn }}</span>
                  </slot>

                  <span class="text-subtitle-2"> {{ $t("passportData.pinfl") }} </span>
                  <slot name="pinfl" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.pinfl }}</span>
                  </slot>
                  <span class="text-subtitle-2"> {{ $t("passportData.genderName") }} </span>
                  <slot name="genderName" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.genderName }}</span>
                  </slot>
                  <span class="text-subtitle-2"> {{ $t("passportData.docExpireOn") }} </span>
                  <slot name="docExpireOn" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.docExpireOn }}</span>
                  </slot>
                  <span class="text-subtitle-2"> {{ $t("passportData.passportSeriesNumber") }} </span>
                  <slot name="docExpireOn" :item="person">
                    <span class="font-weight-bold text-subtitle-1"> {{ person.docSeria + " " + person.docNumber }}</span>
                  </slot>
                  <slot name="outIsMore"></slot>

                  <span v-if="includes || hasMore" class="d-flex cursor-pointer" @click="handleIsMore">
                    {{ $t("more") }}
                    <ChevronUpIcon v-if="isMore" size="16"></ChevronUpIcon>
                    <ChevronDownIcon v-else size="16"></ChevronDownIcon>
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="mt-0" v-if="isMore">
          <v-col cols="12" class="text-center" v-if="isMoreLoading">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-col>
          <v-col cols="12" v-if="!isMoreLoading">
            <div class="user-detail-list">
              <!-- Bandligi -->
              <span class="text-subtitle-2" v-if="includes && includes.includePositionInfo"> {{ $t("passportData.placeAndPositionWork") }} </span>
              <slot name="positionInfo" :item="person" v-if="includes && includes.includePositionInfo">
                <span class="font-weight-bold text-subtitle-1">
                  {{ person?.positionInfo?.position || person?.positionInfo?.organization ? $t("passportData.work") : $t("passportData.notWork") }}
                </span>
              </slot>

              <span class="text-subtitle-2" v-if="includes && includes.includePension"> {{ $t("passportData.pensionType") }} </span>
              <slot name="hasNeuroLogic" :item="person" v-if="includes && includes.includePension">
                <span class="font-weight-bold text-subtitle-1">
                  {{ person.pension?.pensionType || $t("passportData.no") }}
                </span>
              </slot>

              <span class="text-subtitle-2" v-if="includes && includes.includePension"> {{ $t("passportData.pensionAmount") }} </span>
              <slot name="hasNeuroLogic" :item="person" v-if="includes && includes.includePension">
                <span class="font-weight-bold text-subtitle-1">
                  {{ parseNumber(person.pension?.amount || 0) || $t("passportData.no") }}
                </span>
              </slot>
              <slot name="isInMore" :item="person"></slot>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </VCard>
  </div>
</template>
