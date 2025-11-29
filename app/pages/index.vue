<script setup lang="ts">
import type { Van } from "@prisma/client";

const { data: response, status } = await useFetch("/api/vans", {
  lazy: true,
});
const vans = computed(() => response.value?.data || []);
const { data: config } = await useFetch("/api/config");

const services = [
  {
    title: "ประสบการณ์ VIP ระดับพรีเมียม",
    description:
      "บริการรถตู้ VIP ตกแต่งหรูหรา เบาะหนังแท้ปรับไฟฟ้า ระบบนวด เพื่อความสบายสูงสุดตลอดการเดินทางในประเทศไทย",
    icon: "👑",
  },
  {
    title: "พนักงานขับรถมืออาชีพ",
    description:
      "คนขับรถตู้สุภาพ ชำนาญเส้นทางทั่วไทย ผ่านการอบรมมาตรฐานการบริการและความปลอดภัย",
    icon: "driver",
  },
  {
    title: "ความบันเทิงครบครัน",
    description:
      "รถตู้พร้อมเครื่องเสียงระดับไฮเอนด์ คาราโอเกะ และทีวีจอใหญ่ เพลิดเพลินตลอดการเดินทาง",
    icon: "🎵",
  },
  {
    title: "ความปลอดภัยสูงสุด",
    description:
      "รถตู้ทุกคันผ่านการตรวจเช็คสภาพสม่ำเสมอ พร้อมอุปกรณ์ความปลอดภัยครบครัน มั่นใจทุกการเดินทาง",
    icon: "🛡️",
  },
];

useHead({
  title: "Van VIP Service Thailand - บริการเช่ารถตู้ VIP พร้อมคนขับ",
  meta: [
    {
      name: "description",
      content:
        "บริการเช่ารถตู้ VIP นำเที่ยวทั่วไทย รถใหม่ สะอาด คนขับสุภาพ ชำนาญเส้นทาง ราคามาตรฐาน จองเลย Van VIP Service Thailand",
    },
    {
      name: "keywords",
      content:
        "เช่ารถตู้, รถตู้ VIP, เช่ารถตู้พร้อมคนขับ, van rental thailand, van vip service, เหมารถตู้, รถตู้รับส่งสนามบิน",
    },
  ],
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <img
          src="/images/hero-van.png"
          alt="Luxury Van Background"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/90"
        ></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span
          class="text-gold-500 font-medium tracking-[0.2em] uppercase mb-4 block animate-fade-in-up"
          >VAN VIP SERVICE THAILAND</span
        >
        <h1
          class="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100"
        >
          สัมผัส<span class="text-gold-500">ที่สุด</span
          >แห่งการเดินทาง<br />ระดับพรีเมียม
        </h1>
        <p
          class="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200"
        >
          ยกระดับการเดินทางของคุณด้วยรถตู้หรู VIP พร้อมคนขับ
          ตอบโจทย์ทุกไลฟ์สไตล์ ทั้งธุรกิจและท่องเที่ยว
        </p>
        <div
          class="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-300"
        >
          <NuxtLink
            to="#fleet"
            class="bg-gold-500 text-dark-900 px-8 py-4 rounded-full font-bold hover:bg-white transition-all duration-300 shadow-lg shadow-gold-500/20 inline-block"
          >
            ดูรถของเรา
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section
      id="services"
      class="py-24 bg-dark-900 text-white relative overflow-hidden"
    >
      <!-- Decorative elements -->
      <div
        class="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <span
            class="text-gold-500 font-medium tracking-widest uppercase text-sm"
            >ทำไมต้องเลือกเรา</span
          >
          <h2 class="text-3xl md:text-4xl font-serif font-bold mt-2">
            ความเป็นเลิศในทุกรายละเอียด
          </h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
          >
            <div
              class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-gold-500/50 text-gold-500 shadow-lg shadow-black/50"
            >
              <span v-if="service.icon === 'driver'">👨‍✈️</span>
              <span v-else>{{ service.icon }}</span>
            </div>
            <h3
              class="text-xl font-bold mb-3 text-white group-hover:text-gold-400 transition-colors"
            >
              {{ service.title }}
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet Section -->
    <section id="fleet" class="py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span
            class="text-gold-600 font-medium tracking-widest uppercase text-sm"
            >กองทัพรถของเรา</span
          >
          <h2
            class="text-3xl md:text-4xl font-serif font-bold mt-2 text-dark-900"
          >
            เลือกรถที่คุณต้องการ
          </h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div
          v-if="status === 'pending'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <VanCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <div
          v-else-if="vans && vans.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <VanCard v-for="van in vans" :key="van.id" :van="van" />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 text-lg">ไม่มีรถว่างในขณะนี้</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section
      id="contact"
      class="py-24 bg-dark-900 text-white relative overflow-hidden"
    >
      <!-- Decorative elements -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <span
            class="text-gold-500 font-medium tracking-widest uppercase text-sm"
            >ติดต่อเรา</span
          >
          <h2 class="text-3xl md:text-4xl font-serif font-bold mt-2">
            ช่องทางการติดต่อ
          </h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Phone -->
          <div
            v-if="config?.contact_phone"
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-gold-500/50 transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-3xl mb-6 mx-auto border border-white/10 group-hover:border-gold-500/50 text-gold-500 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300"
            >
              📞
            </div>
            <h3 class="text-xl font-bold mb-2">เบอร์โทรศัพท์</h3>
            <p class="text-gray-400 mb-4">โทรสอบถามข้อมูลหรือจองรถ</p>
            <a
              :href="`tel:${config.contact_phone}`"
              class="text-2xl font-serif text-gold-400 hover:text-white transition-colors"
            >
              {{ config.contact_phone }}
            </a>
          </div>

          <!-- Line -->
          <div
            v-if="config?.contact_line"
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-gold-500/50 transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-3xl mb-6 mx-auto border border-white/10 group-hover:border-gold-500/50 text-gold-500 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300"
            >
              💬
            </div>
            <h3 class="text-xl font-bold mb-2">Line Official</h3>
            <p class="text-gray-400 mb-4">แอดไลน์เพื่อสอบถามเพิ่มเติม</p>
            <div class="text-2xl font-serif text-gold-400">
              Line: {{ config.contact_line }}
            </div>
          </div>

          <!-- Email -->
          <div
            v-if="config?.contact_email"
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-gold-500/50 transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-3xl mb-6 mx-auto border border-white/10 group-hover:border-gold-500/50 text-gold-500 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300"
            >
              📧
            </div>
            <h3 class="text-xl font-bold mb-2">อีเมล</h3>
            <p class="text-gray-400 mb-4">ส่งอีเมลถึงเรา</p>
            <a
              :href="`mailto:${config.contact_email}`"
              class="text-lg font-serif text-gold-400 hover:text-white transition-colors break-all"
            >
              {{ config.contact_email }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
