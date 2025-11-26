<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full text-center space-y-8">
      <div>
        <h1 class="text-9xl font-serif font-bold text-gold-500">
          {{ error.statusCode }}
        </h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          {{
            error.statusCode === 404
              ? "ไม่พบหน้าที่คุณต้องการ"
              : "เกิดข้อผิดพลาด"
          }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{
            error.statusCode === 404
              ? "ขออภัย หน้าที่คุณกำลังมองหาอาจถูกลบ ย้าย หรือไม่มีอยู่จริง"
              : error.message
          }}
        </p>
      </div>
      <div class="mt-8">
        <button
          @click="handleError"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-dark-900 hover:bg-gold-500 hover:text-dark-900 transition-all duration-300"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  </div>
</template>
