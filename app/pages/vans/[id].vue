<script setup lang="ts">
import type { Van } from "@prisma/client";

const route = useRoute();
const {
  data: van,
  pending,
  error,
} = await useFetch<Van>(`/api/vans/${route.params.id}`);

const { data: config } = await useFetch("/api/config");

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(price);
};

useHead({
  title: van.value ? `${van.value.name} - Rent Van VIP` : "Van Details",
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <div v-if="pending" class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"
      ></div>
    </div>

    <div
      v-else-if="error || !van"
      class="container mx-auto px-4 py-20 text-center"
    >
      <h1 class="text-3xl font-bold text-gray-900 mb-4">ไม่พบข้อมูลรถ</h1>
      <NuxtLink
        to="/"
        class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
      >
        กลับสู่หน้าหลัก
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Hero / Image Section -->
      <div class="relative h-[60vh] bg-dark-900 overflow-hidden">
        <img
          v-if="van.images?.[0]"
          :src="van.images[0]"
          :alt="van.name"
          class="w-full h-full object-cover opacity-80"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"
        ></div>

        <div class="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div class="container mx-auto">
            <NuxtLink
              to="/#fleet"
              class="text-white/80 hover:text-gold-400 mb-4 inline-flex items-center gap-2 transition-colors"
            >
              ← กลับไปหน้ารวมรถ
            </NuxtLink>
            <h1
              class="text-4xl md:text-6xl font-serif font-bold text-white mb-2"
            >
              {{ van.name }}
            </h1>
            <div class="flex items-center gap-4 text-white/90">
              <span
                class="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider"
                :class="{
                  'bg-green-500': van.status === 'AVAILABLE',
                  'bg-red-500': van.status === 'BOOKED',
                  'bg-yellow-500': van.status === 'MAINTENANCE',
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
              <span class="text-2xl font-serif text-gold-400">
                {{ formatPrice(van.price) }}
                <span class="text-sm text-white font-sans">/วัน</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="container mx-auto px-4 py-12 -mt-10 relative z-10">
        <div class="bg-white rounded-xl shadow-xl p-8 md:p-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <!-- Main Info -->
            <div class="md:col-span-2 space-y-8">
              <div>
                <h2 class="text-2xl font-serif font-bold text-dark-900 mb-4">
                  รายละเอียด
                </h2>
                <p class="text-gray-600 leading-relaxed text-lg">
                  {{ van.description }}
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-serif font-bold text-dark-900 mb-6">
                  สิ่งอำนวยความสะดวก
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="feature in (van.features as string[])"
                    :key="feature"
                    class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <span class="text-gold-500 text-xl">✓</span>
                    <span class="text-gray-700 font-medium">{{ feature }}</span>
                  </div>
                </div>
              </div>

              <!-- Gallery (if more images exist) -->
              <div v-if="van.images && van.images.length > 1">
                <h2 class="text-2xl font-serif font-bold text-dark-900 mb-6">
                  รูปภาพเพิ่มเติม
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(img, idx) in van.images.slice(1)"
                    :key="idx"
                    class="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img :src="img" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar / Booking -->
            <div class="md:col-span-1">
              <div class="bg-dark-900 text-white p-8 rounded-xl sticky top-8">
                <h3 class="text-xl font-serif font-bold mb-6 text-gold-400">
                  สนใจจองรถคันนี้?
                </h3>
                <div class="space-y-4">
                  <a
                    v-if="config?.contact_phone"
                    :href="`tel:${config.contact_phone}`"
                    class="block w-full bg-gold-500 text-dark-900 font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold-500/20 text-center"
                  >
                    ({{ config.contact_phone }}) โทรเลย
                  </a>
                </div>

                <div class="mt-8 pt-8 border-t border-white/10 text-center">
                  <p class="text-sm text-gray-400">
                    หรือโทรสอบถามข้อมูลเพิ่มเติม
                  </p>
                  <p class="text-xl font-bold text-white mt-2">
                    {{ config?.contact_phone || "-" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
