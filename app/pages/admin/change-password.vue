<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const schema = yup.object({
  currentPassword: yup.string().required("กรุณากรอกรหัสผ่านปัจจุบัน"),
  newPassword: yup
    .string()
    .required("กรุณากรอกรหัสผ่านใหม่")
    .min(3, "รหัสผ่านต้องมีความยาวอย่างน้อย 3 ตัวอักษร"),
  confirmPassword: yup
    .string()
    .required("กรุณายืนยันรหัสผ่านใหม่")
    .oneOf([yup.ref("newPassword")], "รหัสผ่านไม่ตรงกัน"),
});

const isSubmitting = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const onSubmit = async (values: any, { resetForm }: any) => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/auth/change-password", {
      method: "POST",
      body: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    });

    await Swal.fire({
      title: "เรียบร้อย!",
      text: "เปลี่ยนรหัสผ่านใหม่ของคุณสำเร็จแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#D97706",
      background: "#ffffff",
      padding: "2em",
      customClass: {
        title: "font-serif text-2xl font-bold text-dark-900",
        popup: "rounded-xl shadow-2xl border-2 border-gold-500",
        confirmButton:
          "px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all",
      },
      backdrop: `
        rgba(0,0,0,0.5)
        left top
        no-repeat
      `,
      timer: 3000,
      timerProgressBar: true,
    });

    resetForm();
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.data?.statusMessage || "ไม่สามารถเปลี่ยนรหัสผ่านได้",
      confirmButtonColor: "#D97706",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">เปลี่ยนรหัสผ่าน</h1>

    <Form :validation-schema="schema" @submit="onSubmit" class="max-w-md">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2"
          >รหัสผ่านปัจจุบัน</label
        >
        <div class="relative">
          <Field
            name="currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all pr-10"
            placeholder="กรอกรหัสผ่านปัจจุบัน"
          />
          <button
            type="button"
            @click="showCurrentPassword = !showCurrentPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              v-if="showCurrentPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <ErrorMessage
          name="currentPassword"
          class="text-red-500 text-sm mt-1"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">รหัสผ่านใหม่</label>
        <div class="relative">
          <Field
            name="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all pr-10"
            placeholder="กรอกรหัสผ่านใหม่"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              v-if="showNewPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2"
          >ยืนยันรหัสผ่านใหม่</label
        >
        <div class="relative">
          <Field
            name="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all pr-10"
            placeholder="ยืนยันรหัสผ่านใหม่"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              v-if="showConfirmPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <ErrorMessage
          name="confirmPassword"
          class="text-red-500 text-sm mt-1"
        />
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <span v-if="isSubmitting">กำลังบันทึก...</span>
        <span v-else>เปลี่ยนรหัสผ่าน</span>
      </button>
    </Form>
  </div>
</template>
