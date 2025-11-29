<template>
  <div
    class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse"
  >
    <!-- Image Container Skeleton -->
    <div class="aspect-[4/3] bg-gray-200 relative"></div>

    <!-- Content Skeleton -->
    <div class="p-6 flex-1 flex flex-col">
      <!-- Title Skeleton -->
      <div class="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>

      <!-- Description Skeleton -->
      <div class="space-y-2 mb-6 flex-1">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <!-- Features Skeleton -->
      <div class="border-t border-gray-100 pt-4 mb-6">
        <div class="flex flex-wrap gap-y-2 gap-x-4">
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-4 bg-gray-200 rounded w-14"></div>
        </div>
      </div>

      <!-- Button Skeleton -->
      <div class="w-full h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
</template>
