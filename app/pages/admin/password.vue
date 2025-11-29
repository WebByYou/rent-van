<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

const schema = yup.object({
  currentPassword: yup.string().required("กรุณากรอกรหัสผ่านปัจจุบัน"),
  newPassword: yup
    .string()
    .required("กรุณากรอกรหัสผ่านใหม่")
    .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: yup
    .string()
    .required("กรุณายืนยันรหัสผ่านใหม่")
    .oneOf([yup.ref("newPassword")], "รหัสผ่านไม่ตรงกัน"),
});

const isSubmitting = ref(false);

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

    Swal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
      confirmButtonColor: "#D97706",
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
        <Field
          name="currentPassword"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
          placeholder="กรอกรหัสผ่านปัจจุบัน"
        />
        <ErrorMessage
          name="currentPassword"
          class="text-red-500 text-sm mt-1"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">รหัสผ่านใหม่</label>
        <Field
          name="newPassword"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
          placeholder="กรอกรหัสผ่านใหม่"
        />
        <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2"
          >ยืนยันรหัสผ่านใหม่</label
        >
        <Field
          name="confirmPassword"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
          placeholder="ยืนยันรหัสผ่านใหม่"
        />
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
