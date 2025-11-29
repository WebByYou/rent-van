<script setup lang="ts">
import type { Van } from "@prisma/client";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

// State
const search = ref("");
const page = ref(1);
const limit = ref(10);
const debouncedSearch = refDebounced(search, 500);

// Data fetching
const {
  data: vansData,
  refresh: refreshVans,
  status,
} = await useFetch("/api/vans", {
  query: {
    page,
    limit,
    search: debouncedSearch,
  },
  watch: [page, debouncedSearch],
});

const vans = computed(() => vansData.value?.data || []);
const meta = computed(
  () => vansData.value?.meta || { total: 0, page: 1, lastPage: 1 }
);

// State
const isDrawerOpen = ref(false);
const editingId = ref<string | null>(null);
const isUploading = ref(false);
const selectedFile = ref<File | null>(null); // New state for selected file
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
  plateNumber: yup.string(),
  phone: yup.string(),
  price: yup.number().typeError("ราคาต้องเป็นตัวเลข"),
  description: yup.string(),
  features: yup.string(),
  images: yup.string(),
  status: yup.string(),
});

// Actions
const openDrawer = (van?: Van) => {
  selectedFile.value = null; // Reset file
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
  selectedFile.value = null;
};

const onSubmit = async (values: any) => {
  isUploading.value = true;
  try {
    let imageUrl = values.images;

    // Upload image if a new file is selected
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("files", selectedFile.value);

      const { urls } = await $fetch<{ urls: string[] }>("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (urls.length > 0) {
        imageUrl = urls[0];
      }
    }

    const payload = {
      ...values,
      features: values.features
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      images: imageUrl
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      price: Number(values.price),
    };

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
    console.error(e);
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถบันทึกข้อมูลได้",
      icon: "error",
      confirmButtonText: "ตกลง",
    });
  } finally {
    isUploading.value = false;
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

const handleFileUpload = (
  event: Event,
  setFieldValue: any,
  currentImages: string
) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    Swal.fire("Error", "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น", "error");
    input.value = "";
    return;
  }

  // Store file for upload on submit
  selectedFile.value = file;

  // Create local preview
  const previewUrl = URL.createObjectURL(file);
  setFieldValue("images", previewUrl);

  input.value = ""; // Reset input to allow selecting same file again
};

const removeImage = (
  index: number,
  setFieldValue: any,
  currentImages: string
) => {
  selectedFile.value = null;
  setFieldValue("images", "");
};
</script>

<template>
  <div class="p-6">
    <!-- Header & Actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <h1 class="text-2xl font-bold text-gray-900">จัดการรถ</h1>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <!-- Search Input -->
        <div class="relative flex-grow sm:flex-grow-0">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="ค้นหาชื่อรถ, ทะเบียน..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          @click="openDrawer()"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>+</span> เพิ่มรถใหม่
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
      ></div>
    </div>

    <!-- Van List -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
    >
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
            <tr v-if="vans.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                ไม่พบข้อมูลรถ
              </td>
            </tr>
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

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        v-if="meta.total > 0"
      >
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              แสดง
              <span class="font-medium">{{ (meta.page - 1) * limit + 1 }}</span>
              ถึง
              <span class="font-medium">{{
                Math.min(meta.page * limit, meta.total)
              }}</span>
              จาก
              <span class="font-medium">{{ meta.total }}</span>
              รายการ
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="page > 1 ? page-- : null"
                :disabled="page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                หน้า {{ meta.page }} / {{ meta.lastPage }}
              </span>
              <button
                @click="page < meta.lastPage ? page++ : null"
                :disabled="page === meta.lastPage"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
        <!-- Mobile Pagination -->
        <div class="flex items-center justify-between sm:hidden w-full">
          <button
            @click="page > 1 ? page-- : null"
            :disabled="page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span class="text-sm text-gray-700">
            หน้า {{ meta.page }} / {{ meta.lastPage }}
          </span>
          <button
            @click="page < meta.lastPage ? page++ : null"
            :disabled="page === meta.lastPage"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
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
                  v-slot="{ setFieldValue, values }"
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
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >รูปภาพ</label
                    >

                    <!-- Image Previews -->
                    <div
                      v-if="values.images"
                      class="grid grid-cols-1 gap-2 mb-4"
                    >
                      <div
                        class="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border"
                      >
                        <img
                          :src="values.images"
                          class="w-full h-full object-cover"
                          alt="Van preview"
                        />
                        <button
                          type="button"
                          @click="removeImage(0, setFieldValue, values.images)"
                          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Upload Input -->
                    <div class="flex items-center justify-center w-full">
                      <label
                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div
                          class="flex flex-col items-center justify-center pt-5 pb-6"
                        >
                          <svg
                            class="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p class="mb-2 text-sm text-gray-500">
                            <span class="font-semibold">คลิกเพื่ออัปโหลด</span>
                          </p>
                        </div>
                        <input
                          type="file"
                          class="hidden"
                          accept="image/*"
                          @change="
                            (e) =>
                              handleFileUpload(e, setFieldValue, values.images)
                          "
                        />
                      </label>
                    </div>

                    <!-- Hidden input for validation -->
                    <Field name="images" type="text" class="hidden" />
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
                      :disabled="isUploading"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="isUploading" class="flex items-center gap-2">
                        <svg
                          class="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        กำลังบันทึก...
                      </span>
                      <span v-else>{{
                        editingId ? "บันทึกการแก้ไข" : "เพิ่มรถ"
                      }}</span>
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
