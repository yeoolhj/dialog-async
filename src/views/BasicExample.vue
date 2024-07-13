<template>
  <div>
    <div>{{ name }}</div>
    <a-button @click="showInlineDialog">编辑名称（内联弹窗）</a-button>
    <a-button @click="showOutlineDialog">编辑名称（外联弹窗）</a-button>
  </div>
</template>
<script setup lang="tsx">
import { showDialog } from "dialog-async";
import { ref } from "vue";
import InputDialog from "../components/InputDialog.vue";

const name = ref("测试");

// 内联弹窗
const showInlineDialog = async () => {
  const dialogText = ref(name.value);
  name.value = await showDialog((dialog) => (
    <a-modal
      title="弹窗"
      visible={dialog.visible}
      onCancel={dialog.cancel}
      onOk={() => dialog.submit(dialogText.value)}
    >
      <a-input v-model={[dialogText.value, "value"]} placeholder="请输入文本" />
    </a-modal>
  ));
};

// 外联弹窗
const showOutlineDialog = async () => {
  name.value = await showDialog(<InputDialog defaultValue={name.value} />);
};
</script>
