<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { IFields } from "@/models/basic";
import { computed, reactive, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";

interface IProps {
  field: IFields;
  item: any;
  fieldIndex: number;
  index: number;
}

const props = defineProps<IProps>();
const { field, item } = toRefs(props);

const { parseNumber, getColor } = useGlobal();
const { t } = useI18n();

const textRef = ref();
const isCollapsed = ref(false);

const style = reactive({
  width: "auto",
  cursor: "auto"
});

const setIsCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
  if (textRef.value) {
    const lineHeight = parseInt(window.getComputedStyle(textRef.value).lineHeight);
    const height = textRef.value.scrollHeight;

    const rows = Math.floor(height / lineHeight);
    style.width = "auto";
    style.cursor = "auto";

    if (rows > 3) {
      style.cursor = "pointer";
      if (isCollapsed.value) {
        style.width = "200px";
      }
    }
  }
};

const parseFieldType = computed(() => {
  return typeof item.value[field.value?.key] == "boolean"
    ? item.value[field.value.key]
      ? t("yes")
      : t("no")
    : field.value.isAmount
    ? parseNumber(item.value[field.value.key])
    : item.value[field.value.key];
});
</script>

<template>
  <td :key="fieldIndex" :class="[field.tdClass, '']">
    <div
      class=""
      @click="setIsCollapsed"
      ref="textRef"
      :style="style"
      :class="[
        {
          'limited-text': !isCollapsed
        }
      ]"
    >
      <template v-if="field.key != 'status' && field.key != 'prtnContractStatus' && field.key != 'state'">
        <slot :name="field.key" :item="item" :index="index" :field="field">
          {{ parseFieldType }}
        </slot>
      </template>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'status'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'prtnContractStatus'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'state'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
    </div>
  </td>
</template>

<style lang="scss" scoped></style>
