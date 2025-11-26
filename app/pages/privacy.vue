<script setup lang="ts">
const { data: page } = await useFetch("/api/pages/privacy");

useHead({
  title: page.value?.title
    ? `${page.value.title} - Rent Van VIP`
    : "นโยบายความเป็นส่วนตัว",
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-20">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-sm p-8 md:p-12 max-w-4xl mx-auto">
        <h1
          class="text-3xl font-serif font-bold text-dark-900 mb-8 border-b pb-4"
        >
          {{ page?.title || "นโยบายความเป็นส่วนตัว" }}
        </h1>
        <div
          v-if="page?.content"
          class="prose prose-lg max-w-none"
          v-html="page.content"
        ></div>
        <div v-else class="text-center text-gray-500 py-12">ยังไม่มีข้อมูล</div>
      </div>
    </div>
  </div>
</template>
