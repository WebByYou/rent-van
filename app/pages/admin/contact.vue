<script setup lang="ts">
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const config = ref({
  contact_phone: "",
  contact_line: "",
  contact_email: "",
});
const isLoading = ref(false);

const fetchConfig = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch("/api/config");
    config.value = {
      contact_phone: data.contact_phone || "",
      contact_line: data.contact_line || "",
      contact_email: data.contact_email || "",
    };
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "Failed to load config", "error");
  } finally {
    isLoading.value = false;
  }
};

const saveConfig = async () => {
  try {
    await $fetch("/api/config", {
      method: "PUT",
      body: config.value,
    });
    Swal.fire({
      title: "สำเร็จ",
      text: "บันทึกข้อมูลเรียบร้อยแล้ว",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    Swal.fire("Error", "Failed to save config", "error");
  }
};

onMounted(() => {
  fetchConfig();
});
</script>

<template>
  <div class="h-full">
    <div class="h-full bg-white flex flex-col overflow-hidden">
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10"
      >
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>📞</span> ข้อมูลการติดต่อ
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">
            จัดการข้อมูลการติดต่อที่แสดงบนหน้าเว็บไซต์
          </p>
        </div>
        <div>
          <button
            @click="saveConfig"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-sm flex items-center gap-2 transition-all text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            บันทึก
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto bg-white p-8">
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
          ></div>
        </div>
        <div v-else class="max-w-2xl space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >เบอร์โทรศัพท์</label
            >
            <input
              v-model="config.contact_phone"
              type="text"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="081-234-5678"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Line ID</label
            >
            <input
              v-model="config.contact_line"
              type="text"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="@luxuryvan"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >อีเมล</label
            >
            <input
              v-model="config.contact_email"
              type="email"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="booking@luxuryvan.com"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
