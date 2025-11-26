<script setup lang="ts">
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const router = useRouter();

const pages = [
  { slug: "about", name: "เกี่ยวกับเรา", icon: "🏢" },
  { slug: "terms", name: "เงื่อนไขการให้บริการ", icon: "📜" },
  { slug: "privacy", name: "นโยบายความเป็นส่วนตัว", icon: "🔒" },
];

// Get slug from query or default to 'about'
const selectedPageSlug = computed({
  get: () => (route.query.page as string) || "about",
  set: (val) => router.push({ query: { ...route.query, page: val } }),
});

const pageData = ref({ title: "", content: "" });
const isLoading = ref(false);
const isEditing = ref(false);

const selectedPageName = computed(() => {
  return pages.find((p) => p.slug === selectedPageSlug.value)?.name || "";
});

const fetchPage = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch(`/api/pages/${selectedPageSlug.value}`);
    pageData.value = {
      title: data.title || "",
      content: data.content || "",
    };
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "Failed to load page content", "error");
  } finally {
    isLoading.value = false;
  }
};

const savePage = async () => {
  try {
    await $fetch(`/api/pages/${selectedPageSlug.value}`, {
      method: "PUT",
      body: pageData.value,
    });
    Swal.fire({
      title: "สำเร็จ",
      text: "บันทึกข้อมูลเรียบร้อยแล้ว",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    isEditing.value = false;
  } catch (e) {
    Swal.fire("Error", "Failed to save page content", "error");
  }
};

// Watch for route changes to fetch new data
watch(
  () => route.query.page,
  (newVal) => {
    if (newVal) {
      isEditing.value = false; // Reset edit mode on page change
      fetchPage();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full">
    <!-- Content Area -->
    <div class="h-full bg-white flex flex-col overflow-hidden">
      <!-- Header (Navbar) -->
      <div
        class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10"
      >
        <!-- Left: Title & Description -->
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{{
              pages.find((p) => p.slug === selectedPageSlug)?.icon
            }}</span>
            {{ selectedPageName }}
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">
            จัดการข้อมูลและเนื้อหาสำหรับหน้า {{ selectedPageName }}
          </p>
        </div>

        <!-- Right: Actions -->
        <div v-if="!isLoading">
          <button
            v-if="!isEditing"
            @click="isEditing = true"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2 transition-all text-sm"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            แก้ไขเนื้อหา
          </button>
          <div v-else class="flex gap-2">
            <button
              @click="
                isEditing = false;
                fetchPage();
              "
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all text-sm"
            >
              ยกเลิก
            </button>
            <button
              @click="savePage"
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
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto bg-white">
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
          ></div>
        </div>

        <div v-else class="h-full">
          <!-- View Mode -->
          <div v-if="!isEditing" class="p-8 min-h-full">
            <div
              v-if="pageData.content"
              class="prose prose-lg max-w-none text-gray-600"
              v-html="pageData.content"
            ></div>
            <div
              v-else
              class="text-center py-20 text-gray-400 flex flex-col items-center justify-center h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>ยังไม่มีเนื้อหา</p>
              <p class="text-sm mt-2">กดปุ่ม "แก้ไขเนื้อหา" เพื่อเริ่มเขียน</p>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="p-6 space-y-6 h-full flex flex-col">
            <div class="flex-1 flex flex-col h-full">
              <div
                class="border rounded-lg overflow-hidden bg-white flex-1 flex flex-col"
              >
                <QuillEditor v-model="pageData.content" class="flex-1" />
              </div>
              <p class="text-xs text-gray-500 mt-2 text-right">
                * สามารถจัดรูปแบบข้อความได้ แต่ไม่รองรับการอัปโหลดรูปภาพ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
