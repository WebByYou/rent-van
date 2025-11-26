<script setup lang="ts">
const { data: config } = await useFetch("/api/config");

useSeoMeta({
  title: config.value?.siteTitle || "บริการเช่ารถตู้ VIP",
  description:
    config.value?.siteDescription ||
    "บริการเช่ารถตู้ VIP พร้อมคนขับ ระดับพรีเมียม",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
