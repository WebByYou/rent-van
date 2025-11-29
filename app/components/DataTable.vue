<script setup lang="ts">
import { computed } from "vue";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

const props = defineProps<{
  columns: Column[];
  data: any[];
  loading?: boolean;
  pagination?: Pagination;
  selectedIds?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}>();

const emit = defineEmits<{
  (e: "update:selectedIds", value: string[]): void;
  (e: "update:pagination", value: Pagination): void;
  (e: "sort", sortBy: string, sortOrder: "asc" | "desc"): void;
  (e: "row-click", item: any): void;
}>();

// Selection Logic
const allSelected = computed(() => {
  return (
    props.data.length > 0 &&
    props.selectedIds?.length === props.data.length &&
    props.data.every((item) => props.selectedIds?.includes(item.id))
  );
});

const toggleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    emit(
      "update:selectedIds",
      props.data.map((item) => item.id)
    );
  } else {
    emit("update:selectedIds", []);
  }
};

const toggleSelectRow = (id: string) => {
  const newSelection = [...(props.selectedIds || [])];
  const index = newSelection.indexOf(id);
  if (index === -1) {
    newSelection.push(id);
  } else {
    newSelection.splice(index, 1);
  }
  emit("update:selectedIds", newSelection);
};

// Sorting Logic
const handleSort = (column: Column) => {
  if (!column.sortable) return;

  let newOrder: "asc" | "desc" = "asc";
  if (props.sortBy === column.key && props.sortOrder === "asc") {
    newOrder = "desc";
  }

  emit("sort", column.key, newOrder);
};

// Pagination Logic
const changePage = (newPage: number) => {
  if (
    props.pagination &&
    newPage >= 1 &&
    newPage <= props.pagination.lastPage
  ) {
    emit("update:pagination", { ...props.pagination, page: newPage });
  }
};

const changeLimit = (event: Event) => {
  const newLimit = Number((event.target as HTMLSelectElement).value);
  if (props.pagination) {
    emit("update:pagination", {
      ...props.pagination,
      limit: newLimit,
      page: 1,
    });
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
    <!-- Loading Overlay -->
    <div v-if="loading" class="p-12 flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
      ></div>
    </div>

    <div v-else class="flex flex-col">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <!-- Checkbox Column -->
              <th v-if="selectedIds" class="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>

              <!-- Data Columns -->
              <th
                v-for="col in columns"
                :key="col.key"
                @click="handleSort(col)"
                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
                :class="[
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left',
                  col.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                ]"
              >
                <div
                  class="flex items-center gap-1"
                  :class="{
                    'justify-end': col.align === 'right',
                    'justify-center': col.align === 'center',
                  }"
                >
                  {{ col.label }}
                  <span v-if="sortBy === col.key" class="text-indigo-600">
                    {{ sortOrder === "asc" ? "↑" : "↓" }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="data.length === 0">
              <td
                :colspan="(selectedIds ? 1 : 0) + columns.length"
                class="px-6 py-12 text-center text-gray-500"
              >
                ไม่พบข้อมูล
              </td>
            </tr>
            <tr
              v-for="item in data"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Checkbox Cell -->
              <td v-if="selectedIds" class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(item.id)"
                  @change="toggleSelectRow(item.id)"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>

              <!-- Data Cells -->
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                :class="[
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left',
                ]"
              >
                <slot :name="`cell-${col.key}`" :item="item">
                  {{ item[col.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.total > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.lastPage"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-700">
              แสดง
              <span class="font-medium">{{
                (pagination.page - 1) * pagination.limit + 1
              }}</span>
              ถึง
              <span class="font-medium">{{
                Math.min(pagination.page * pagination.limit, pagination.total)
              }}</span>
              จาก
              <span class="font-medium">{{ pagination.total }}</span>
              รายการ
            </p>
            <select
              :value="pagination.limit"
              @change="changeLimit"
              class="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="5">5 / หน้า</option>
              <option value="10">10 / หน้า</option>
              <option value="20">20 / หน้า</option>
              <option value="50">50 / หน้า</option>
            </select>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                หน้า {{ pagination.page }} / {{ pagination.lastPage }}
              </span>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page === pagination.lastPage"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
      </div>
    </div>
  </div>
</template>
