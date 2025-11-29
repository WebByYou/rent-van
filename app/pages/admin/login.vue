<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const password = ref("");
const loginError = ref("");
const isSubmitting = ref(false);

const login = async () => {
  isSubmitting.value = true;
  loginError.value = "";
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { password: password.value },
    });
    // Redirect to admin dashboard
    await navigateTo("/admin");
  } catch (e) {
    loginError.value = "รหัสผ่านไม่ถูกต้อง";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-serif font-bold text-dark-900">
        Admin<span class="text-gold-500">Panel</span>
      </h1>
      <p class="text-gray-500 mt-2">เข้าสู่ระบบเพื่อจัดการเว็บไซต์</p>
    </div>
    <form @submit.prevent="login" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >รหัสผ่าน</label
        >
        <input
          v-model="password"
          type="password"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 p-3 border"
          placeholder="••••••••"
        />
      </div>
      <p v-if="loginError" class="text-red-600 text-sm text-center">
        {{ loginError }}
      </p>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-dark-900 text-white py-3 px-4 rounded-lg hover:bg-gold-500 hover:text-dark-900 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting">กำลังเข้าสู่ระบบ...</span>
        <span v-else>เข้าสู่ระบบ</span>
      </button>
    </form>
    <div class="mt-6 text-center">
      <NuxtLink to="/" class="text-sm text-gray-500 hover:text-dark-900"
        >← กลับไปหน้าเว็บไซต์</NuxtLink
      >
    </div>
  </div>
</template>
