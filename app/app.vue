<script setup lang="ts">
const { data: config } = await useFetch("/api/config");

useSeoMeta({
  title: config.value?.siteTitle || "Van VIP Service Thailand",
  description:
    config.value?.siteDescription ||
    "บริการเช่ารถตู้ VIP พร้อมคนขับ นำเที่ยวทั่วไทย ระดับพรีเมียม",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
