# dialog-async

## 安装

```
npm install dialog-async
```

## 示例代码

根组件引入 DialogProvider

```html
<script lang="ts" setup>
  import { DialogProvider } from "dialog-async";
</script>
<template>
  <DialogProvider>
    <router-view />
  </DialogProvider>
</template>
```

页面使用

```html
<template>
  <div class="text-center mt-[100px]">
    <div>{{ name }}</div>
    <a-button @click="showInlineDialog">编辑名称（内联弹窗）</a-button>
    <a-button @click="showOutlineDialog">编辑名称（外联弹窗）</a-button>
  </div>
</template>
<script setup lang="tsx">
  import { showDialog } from "dialog-async";
  import InputDialog from "./InputDialog.vue";

  const name = ref("test");

  // 内联弹窗
  const showInlineDialog = () => {
    const dialogText = ref(name.value);
    showDialog((dialog) => (
      <a-modal
        title="弹窗"
        visible={dialog.visible}
        onCancel={dialog.cancel}
        onOk={() => {
          name.value = dialogText.value;
          dialog.submit();
        }}
      >
        <a-input
          v-model={[dialogText.value, "value"]}
          placeholder="请输入文本"
        />
      </a-modal>
    ));
  };

  // 外联弹窗
  const showOutlineDialog = async () => {
    name.value = await showDialog(<InputDialog defaultValue={name.value} />);
  };
</script>
```

弹窗组件 InputDialog.vue

```html
<template>
  <a-modal
    title="弹窗"
    :visible="dialog.visible"
    @cancel="dialog.cancel"
    @ok="submit"
  >
    <a-input v-model:value="text" placeholder="请输入文本" />
  </a-modal>
</template>
<script setup lang="ts">
  import { useDialog } from "dialog-async";

  const props = defineProps({
    defaultValue: String,
  });

  const dialog = useDialog();

  const text = ref(props.defaultValue);

  function submit() {
    dialog.submit(text.value);
  }
</script>
```

- 弹窗的使用支持`内联`和`外联`两种方式

  - `内联`showDialog()接收一个返回值为 vue 组件的函数，弹窗组件可以直接写在页面中
  - `外联`showDialog()接收一个 vue 组件，弹窗组件可以单独创建文件

- 将弹窗控制抽象为一个拥有`visible`、`cancel`、`submit`属性的 Promise 对象`dialog`。
  - `showDialog()`和`useDialog()`都会返回这个 Promise 对象
  - `dialog.submit()` 关闭弹窗并触发 Promise.resolve()
  - `dialog.cancel()` 关闭弹窗并触发 Promise.reject()
  - `dialog.visible` 弹窗显隐的状态的只读属性，它的改变应仅通过 cancel/submit 触发
