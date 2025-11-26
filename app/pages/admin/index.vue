<script setup lang="ts">
import type { Van } from "@prisma/client";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

// Data fetching
const { data: vans, refresh: refreshVans } = await useFetch<Van[]>("/api/vans");

// State
const isDrawerOpen = ref(false);
const editingId = ref<string | null>(null);
const initialValues = ref({
  name: "",
  plateNumber: "",
  price: 0,
  description: "",
  features: "",
  images: "",
  phone: "",
  status: "AVAILABLE",
});

// Validation Schema
const schema = yup.object({
  name: yup.string().required("กรุณาระบุชื่อรถ"),
  plateNumber: yup.string().required("กรุณาระบุทะเบียนรถ"),
  phone: yup.string().required("กรุณาระบุเบอร์โทรศัพท์"),
  price: yup
    .number()
    .required("กรุณาระบุราคา")
    .min(1, "ราคาต้องมากกว่า 0")
    .typeError("ราคาต้องเป็นตัวเลข"),
  description: yup.string().required("กรุณาระบุรายละเอียด"),
  features: yup.string().required("กรุณาระบุคุณสมบัติ"),
  images: yup.string().required("กรุณาระบุ URL รูปภาพ"),
  status: yup.string().required("กรุณาเลือกสถานะ"),
});

// Actions
const openDrawer = (van?: Van) => {
  if (van) {
    editingId.value = van.id;
    initialValues.value = {
      name: van.name,
      plateNumber: van.plateNumber,
      price: van.price,
      description: van.description,
      features: (van.features as string[]).join(", "),
      images: van.images.join(", "),
      phone: van.phone || "",
      status: van.status,
    };
  } else {
    editingId.value = null;
    initialValues.value = {
      name: "",
      plateNumber: "",
      price: 0,
      description: "",
      features: "",
      images: "",
      phone: "",
      status: "AVAILABLE",
    };
  }
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  editingId.value = null;
};

const onSubmit = async (values: any) => {
  const payload = {
    ...values,
    features: values.features
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean),
    images: values.images
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean),
    price: Number(values.price),
  };

  try {
    if (editingId.value) {
      // Update
      await $fetch(`/api/vans/${editingId.value}`, {
        method: "PUT",
        body: payload,
      });
      Swal.fire({
        title: "สำเร็จ!",
        text: "แก้ไขข้อมูลรถเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    } else {
      // Create
      await $fetch("/api/vans", {
        method: "POST",
        body: payload,
      });
      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มรถเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    }

    await refreshVans();
    closeDrawer();
  } catch (e) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: editingId.value ? "ไม่สามารถแก้ไขข้อมูลได้" : "ไม่สามารถเพิ่มรถได้",
      icon: "error",
      confirmButtonText: "ตกลง",
    });
  }
};

const deleteVan = async (id: string) => {
  const result = await Swal.fire({
    title: "ยืนยันการลบ?",
    text: "คุณต้องการลบรถคันนี้ใช่หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "ใช่, ลบเลย",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/vans/${id}`, { method: "DELETE" });
      await refreshVans();
      Swal.fire("ลบเรียบร้อย!", "รถถูกลบออกจากระบบแล้ว", "success");
    } catch (e) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบรถได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  }
};
</script>

<template>
  <div class="p-6">
    <!-- Header & Actions -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">จัดการรถ</h1>
      <button
        @click="openDrawer()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
      >
        <span>+</span> เพิ่มรถใหม่
      </button>
    </div>

    <!-- Van List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ชื่อรถ
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ทะเบียน
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                เบอร์โทรศัพท์
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ราคา/วัน
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                สถานะ
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="van in vans" :key="van.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ van.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ van.plateNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ van.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ van.price.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': van.status === 'AVAILABLE',
                    'bg-red-100 text-red-800': van.status === 'BOOKED',
                    'bg-yellow-100 text-yellow-800':
                      van.status === 'MAINTENANCE',
                  }"
                >
                  {{
                    van.status === "AVAILABLE"
                      ? "ว่าง"
                      : van.status === "BOOKED"
                      ? "จองแล้ว"
                      : "ปรับปรุง"
                  }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
              >
                <button
                  @click="openDrawer(van)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  แก้ไข
                </button>
                <button
                  @click="deleteVan(van.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right Drawer -->
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 overflow-hidden z-50"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 overflow-hidden">
        <!-- Background overlay -->
        <div
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeDrawer"
        ></div>

        <div
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
        >
          <div class="pointer-events-auto w-screen max-w-md">
            <div
              class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
            >
              <div class="px-4 py-6 sm:px-6 bg-indigo-700">
                <div class="flex items-start justify-between">
                  <h2
                    class="text-lg font-medium text-white"
                    id="slide-over-title"
                  >
                    {{ editingId ? "แก้ไขข้อมูลรถ" : "เพิ่มรถใหม่" }}
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      class="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none"
                      @click="closeDrawer"
                    >
                      <span class="sr-only">Close panel</span>
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="relative flex-1 px-4 py-6 sm:px-6">
                <!-- Form -->
                <Form
                  :validation-schema="schema"
                  :initial-values="initialValues"
                  @submit="onSubmit"
                  class="space-y-6"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ชื่อรถ</label
                    >
                    <Field
                      name="name"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="name"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ทะเบียนรถ</label
                    >
                    <Field
                      name="plateNumber"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="plateNumber"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >เบอร์โทรศัพท์</label
                    >
                    <Field
                      name="phone"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="phone"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ราคา (ต่อวัน)</label
                    >
                    <Field
                      name="price"
                      type="number"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="price"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >รายละเอียด</label
                    >
                    <Field
                      name="description"
                      as="textarea"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="description"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >คุณสมบัติ (คั่นด้วยคอมม่า)</label
                    >
                    <Field
                      name="features"
                      type="text"
                      placeholder="แอร์, GPS, บลูทูธ"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="features"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >รูปภาพ (URL คั่นด้วยคอมม่า)</label
                    >
                    <Field
                      name="images"
                      type="text"
                      placeholder="https://..."
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <ErrorMessage
                      name="images"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >สถานะ</label
                    >
                    <Field
                      name="status"
                      as="select"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="AVAILABLE">ว่าง</option>
                      <option value="BOOKED">จองแล้ว</option>
                      <option value="MAINTENANCE">ปรับปรุง</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      class="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div class="pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {{ editingId ? "บันทึกการแก้ไข" : "เพิ่มรถ" }}
                    </button>
                    <button
                      type="button"
                      @click="closeDrawer"
                      class="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
