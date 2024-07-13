<script setup lang="ts">
import { DialogProvider } from "dialog-async";
import BasicExample from "./views/BasicExample.vue";
</script>

<template>
  <DialogProvider>
    <BasicExample />
  </DialogProvider>
</template>
