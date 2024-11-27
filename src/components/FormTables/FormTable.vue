<script setup lang="ts">
import { ITable } from "@/models/vuetify/types";
import { computed, onMounted, ref, toRefs, watch } from "vue";
import FormTd from "./FormTd.vue";
import { IFields } from "@/models/basic";
import axios from "axios";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useGlobal } from "@/composables/useGlobal";
import { VCard, VMenu } from "vuetify/components";
import { UserSettingService } from "@/services/Settings/UserSettings.service";

const props = withDefaults(defineProps<ITable>(), {
  permission: "",
  hasPagination: true,
  apiName: "GetList",
  tableHeight: "540",
  resData: "rows",
  density: "compact",
  fixedHeader: true,
  identifier: true,
  removeKeys: () => [],
  params: {}
});

const emits = defineEmits(["createRouteQuery", "rowClick", "rowDblClick", "update:fields", "update:filter", "beforeRequest"]);

const { fields, filter, service, apiName } = toRefs(props);
const { setError } = useErrorToast();
const { parseNumber } = useGlobal();

const data = ref<any[]>([]);
const allData = ref<any>();
const loading = ref<boolean>(true);
const isMenu = ref(false);

const itemFilter = computed({
  get: () => filter.value,
  set: (newValue) => emits("update:filter", newValue)
});

/* Pagination */
const firstNumber = computed(() => {
  if (itemFilter.value) {
    return (itemFilter.value.page - 1) * itemFilter.value.pageSize + 1;
  }
  return 0;
});

const lastNumber = computed(() => {
  if (itemFilter.value) {
    if (itemFilter.value.totalRows < itemFilter.value.pageSize) {
      return itemFilter.value.totalRows;
    } else {
      if (itemFilter.value.page * itemFilter.value.pageSize > itemFilter.value.totalRows) {
        return itemFilter.value.totalRows;
      } else {
        return itemFilter.value.page * itemFilter.value.pageSize;
      }
    }
  }
  return 0;
});

/* END Pagination */

/* fetchFields */
const pathName = window.location.pathname.substring(1).split("/").join("");

const mapFields = (arr: IFields[]) => {
  return arr.map((el) => {
    if (typeof el.visible == "undefined") {
      return (el = {
        ...el,
        visible: true
      });
    }
    return el;
  });
};

const itemFields = computed({
  get: () => mapFields(fields.value),
  set: (newValue) => emits("update:fields", mapFields(newValue))
});

const checkFields = mapFields(fields.value).filter((el) => el.visible);

const getByKey = () => {
  UserSettingService.GetByKey(`${pathName}`)
    .then((res) => {
      if (res.data?.value) {
        itemFields.value = JSON.parse(res.data.value);
      }
    })
    .catch(() => {
      itemFields.value = fields.value;
    });
};

const updateFields = () => {
  UserSettingService.Save({
    userKey: pathName,
    value: JSON.stringify(itemFields.value)
  }).then(() => {
    getByKey();
    isMenu.value = false;
  });
};

const changeFields = (value: IFields) => {
  value.visible = !value.visible;
};

const sort = (item: any) => {
  if (itemFilter.value) {
    itemFilter.value.sortBy = item.key;
    if (itemFilter.value.orderType == "asc") {
      itemFilter.value.orderType = "desc";
    } else {
      itemFilter.value.orderType = "asc";
    }
    refresh();
  }
};

/* Data */
const getData = () => {
  const promise = new Promise((resolve, reject) => {
    loading.value = true;
    emits("createRouteQuery", {
      filter: itemFilter.value,
      params: props.params,
      removeKeys: props.removeKeys
    });

    resolve("success");
  });

  promise.then(() => {
    try {
      service.value[apiName.value](itemFilter.value)
        .then((res: any) => {
          allData.value = res.data;
          if (props.resData.length > 0) {
            data.value = res.data[props.resData];
          } else {
            data.value = res.data;
          }
          itemFilter.value.totalRows = res.data.total;
          loading.value = false;
        })
        .catch((error: any) => {
          if (axios.isCancel(error)) {
            loading.value = true;
            return;
          }
          setError(error);
          loading.value = false;
        });
    } catch (e) {
      throw new Error(`что то пошло не так, подробности: ${e}`);
    }
  });
};

const refresh = () => {
  const promise = new Promise((resolve, reject) => {
    emits("createRouteQuery", {
      filter: itemFilter.value,
      params: props.params,
      removeKeys: props.removeKeys
    });

    resolve("success");
  });
  promise.then(() => {
    loading.value = true;
    try {
      emits("createRouteQuery", {
        filter: itemFilter.value,
        params: props.params,
        removeKeys: props.removeKeys
      });

      data.value = [];
      service.value[apiName.value](itemFilter.value)
        .then((res: any) => {
          if (props.resData.length > 0) {
            data.value = res.data[props.resData];
          } else {
            data.value = res.data;
          }
          itemFilter.value.totalRows = res.data.total;
          loading.value = false;
        })
        .catch((error: any) => {
          if (axios.isCancel(error)) {
            loading.value = true;
            return;
          }
          setError(error);
          loading.value = false;
        });
    } catch (e) {
      throw new Error(`что то пошло не так, подробности: ${e}`);
    }
  });
};

/* END DATA */

defineExpose({
  refresh,
  sort,
  getData
});

watch(
  () => props.manualRefresh,
  () => {
    refresh();
  }
);
watch(
  () => props.identifier,
  (val) => {
    if (val) {
      refresh();
    }
  }
);

onMounted(() => {
  getByKey();
  if (props.identifier) {
    getData();
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <slot name="header" :refresh="refresh" :getData="getData" :loading="loading" :parseNumber="parseNumber" :data="allData"> </slot>
    <v-card class="border" elevation="0">
      <v-card-title>
        <v-row>
          <v-col cols="12" lg="3">
            <VMenu v-model="isMenu" :closeOnContentClick="false" scroll-strategy="close">
              <template #activator="{ props }">
                <v-btn v-bind="props" color="lightGrey" variant="flat">
                  {{ $t("selectKey") }}
                </v-btn>
              </template>
              <VCard>
                <v-card-text>
                  <v-list>
                    <v-list-item @click="changeFields(field)" v-for="field in itemFields" :value="field.key">
                      <template #title> {{ $t(field.key) }}</template>
                      <template #append>
                        <v-icon color="rgb(var(--v-theme-success))" v-if="field.visible !== undefined && field.visible">mdi-check</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="isMenu = false" color="error"> {{ $t("Cancel") }} </v-btn>
                  <v-btn @click="updateFields" color="success"> {{ $t("Save") }} </v-btn>
                </v-card-actions>
              </VCard>
            </VMenu>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="px-0">
        <v-table
          :height="tableHeight"
          :density="density"
          :fixed-header="fixedHeader"
          :fixed-footer="fixedFooter"
          :class="tableClass"
          :hover="hover"
          :ref="tableRef"
        >
          <thead>
            <tr>
              <th class="font-weight-bold text-center" v-if="prependAction">
                <v-label>{{ $t("actions") }}</v-label>
              </th>
              <template v-for="field in checkFields">
                <slot :name="`header-${field.key}`">
                  <th class="font-weight-bold border">
                    <v-label>
                      {{ $t(field.label) }}
                    </v-label>
                  </th>
                </slot>
              </template>

              <th class="font-weight-bold text-center" v-if="appendAction">
                <v-label>{{ $t("actions") }}</v-label>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Before rendering data conditions -->
            <tr v-if="loading">
              <td class="px-0" :colspan="fields.length + 1">
                <div>
                  <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                  <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                </div>
              </td>
            </tr>

            <tr v-if="(!loading && data && data.length == 0) || (!loading && !data)">
              <td :class="[`font-weight-bold h5 text-center bg-light`]" :colspan="fields.length + 1">
                <div>
                  {{ $t("NotFound") }}
                </div>
              </td>
            </tr>

            <!-- RENDERING DATA -->
            <tr v-for="(item, index) in data" :key="index">
              <td v-if="prependAction">
                <slot name="prepend-action" :item="item" :refresh="refresh" :getData="getData"> </slot>
              </td>
              <template v-for="(field, fieldIndex) in checkFields">
                <slot :name="`item-${field.key}`" :item="item" :index="index" :field="field" :data="allData" :rows="data">
                  <FormTd :field="field" :fieldIndex="fieldIndex" :item="item" :index="index" :all-data="allData" :data="data">
                    <template v-for="(_, name) in ($slots as {})" #[name]="slotData">
                      <slot :name="name" v-bind="slotData || {}" />
                    </template>
                  </FormTd>
                </slot>
              </template>
              <td v-if="appendAction">
                <slot name="append-actions" :item="item" :refresh="refresh" :getData="getData"> </slot>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <slot name="pagination" :lastNumber="lastNumber" :firstNumber="firstNumber" :filter="filter" :refresh="refresh" :getData="getData">
      <v-row class="mt-1" v-if="itemFilter && hasPagination">
        <v-col cols="12" lg="6" class="d-flex" style="align-items: center">
          <div class="mr-2">
            <v-select
              density="compact"
              class="mt-4"
              v-model="filter.pageSize"
              @update:modelValue="getData"
              :items="[20, 50, 100, 200, 500]"
              variant="solo-filled"
            />
          </div>
          <div>
            <v-label class="text-grey200">
              {{
                $t("RecordsFrom", {
                  current: firstNumber,
                  pageSize: lastNumber,
                  count: filter.totalRows
                })
              }}
            </v-label>
          </div>
        </v-col>
        <v-col cols="12" lg="6" class="text-right">
          <v-pagination
            @click="getData"
            rounded="circle"
            class="my-custom-pagination"
            v-model="filter.page"
            :length="Math.ceil(filter.totalRows / filter.pageSize)"
            :total-visible="4"
          ></v-pagination>
        </v-col>
      </v-row>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.v-card-actions {
  position: sticky;
  bottom: 0;
  z-index: 999;
  background-color: rgba(var(--v-theme-surface));
}
a {
  text-decoration: none;
  outline: none;
  background: transparent;
}
</style>
