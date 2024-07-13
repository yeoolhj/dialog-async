<template>
  <a-modal
    title="弹窗"
    :visible="dialog.visible"
    @cancel="dialog.cancel"
    @ok="dialog.submit(text)"
  >
    <a-input v-model:value="text" placeholder="请输入文本" />
  </a-modal>
</template>
<script setup lang="ts">
import { useDialog } from "dialog-async";
import { ref } from "vue";

const props = defineProps({
  defaultValue: String,
});

const text = ref(props.defaultValue);

const dialog = useDialog();
</script>
