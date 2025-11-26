<script setup lang="ts">
import type { Van } from "@prisma/client";

defineProps<{
  van: Van;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(price);
};
</script>

<template>
  <div
    class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold-200 flex flex-col h-full"
  >
    <!-- Image Container -->
    <div class="aspect-[4/3] relative overflow-hidden">
      <img
        v-if="van.images?.[0]"
        :src="van.images[0]"
        :alt="van.name"
        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"
      >
        ไม่มีรูปภาพ
      </div>

      <!-- Overlay Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"
      ></div>

      <!-- Status Badge -->
      <div class="absolute top-4 right-4">
        <span
          class="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm shadow-lg backdrop-blur-md"
          :class="{
            'bg-green-500/90 text-white': van.status === 'AVAILABLE',
            'bg-red-500/90 text-white': van.status === 'BOOKED',
            'bg-yellow-500/90 text-black': van.status === 'MAINTENANCE',
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
      </div>

      <!-- Price Tag -->
      <div class="absolute bottom-4 left-4 text-white">
        <p class="text-xs opacity-90 uppercase tracking-wider mb-1">
          ราคาเริ่มต้น
        </p>
        <p class="text-2xl font-serif font-bold text-gold-400">
          {{ formatPrice(van.price)
          }}<span class="text-sm text-white font-sans font-normal">/วัน</span>
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-1 flex flex-col">
      <h3
        class="text-xl font-serif font-bold text-dark-900 mb-2 group-hover:text-gold-600 transition-colors"
      >
        {{ van.name }}
      </h3>

      <p class="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
        {{ van.description }}
      </p>

      <div class="border-t border-gray-100 pt-4 mb-6">
        <div class="flex flex-wrap gap-y-2 gap-x-4">
          <div
            v-for="feature in (van.features as string[])"
            :key="feature"
            class="flex items-center gap-2 text-xs text-gray-600 font-medium"
          >
            <span class="text-gold-500">✓</span> {{ feature }}
          </div>
        </div>
      </div>

      <NuxtLink
        :to="`/vans/${van.id}`"
        class="w-full py-3 bg-dark-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gold-500 hover:text-dark-900 transition-all duration-300 shadow-md hover:shadow-gold-500/25 text-center block"
      >
        ดูรายละเอียด
      </NuxtLink>
    </div>
  </div>
</template>
