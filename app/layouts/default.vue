<script setup lang="ts">
// Layout logic if needed
const { data: config } = await useFetch("/api/config");
</script>

<template>
  <div
    class="min-h-screen bg-white text-dark-900 font-sans selection:bg-gold-500 selection:text-white"
  >
    <!-- Navbar -->
    <nav
      class="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300"
    >
      <div
        class="container mx-auto px-4 h-20 flex justify-between items-center"
      >
        <NuxtLink to="/" class="text-2xl font-serif font-bold text-dark-900">
          VAN VIP SERVICE <span class="text-gold-500">THAILAND</span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-8">
          <NuxtLink
            to="/"
            class="text-dark-800 hover:text-gold-600 font-medium transition-colors"
            >หน้าแรก</NuxtLink
          >
          <NuxtLink
            to="/#services"
            class="text-dark-800 hover:text-gold-600 font-medium transition-colors"
            >บริการ</NuxtLink
          >
          <NuxtLink
            to="/#fleet"
            class="text-dark-800 hover:text-gold-600 font-medium transition-colors"
            >รถของเรา</NuxtLink
          >
          <NuxtLink
            to="/about"
            class="text-dark-800 hover:text-gold-600 font-medium transition-colors"
            >เกี่ยวกับเรา</NuxtLink
          >
        </div>

        <NuxtLink
          to="/#contact"
          class="bg-dark-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20"
        >
          ติดต่อเรา
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-dark-900 text-white py-12 border-t border-white/10">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 class="text-2xl font-serif font-bold mb-6">
              VAN VIP SERVICE <span class="text-gold-500">THAILAND</span>
            </h3>
            <p class="text-gray-400 leading-relaxed">
              สัมผัสประสบการณ์ความสะดวกสบายและสไตล์ที่เหนือระดับกับบริการเช่ารถตู้พรีเมียมของเรา
              เหมาะสำหรับการเดินทางเพื่อธุรกิจ ท่องเที่ยวกับครอบครัว
              และโอกาสพิเศษต่างๆ
            </p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 text-gold-400">ติดต่อเรา</h4>
            <ul class="space-y-4 text-gray-400">
              <li v-if="config?.contact_phone" class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold-500"
                  >📞</span
                >
                {{ config.contact_phone }}
              </li>
              <li v-if="config?.contact_line" class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold-500"
                  >💬</span
                >
                {{ config.contact_line }}
              </li>
              <li v-if="config?.contact_email" class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold-500"
                  >📧</span
                >
                {{ config.contact_email }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 text-gold-400">ลิงก์ด่วน</h4>
            <ul class="space-y-3 text-gray-400">
              <li>
                <NuxtLink
                  to="/about"
                  class="hover:text-gold-500 transition-colors"
                  >เกี่ยวกับเรา</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/terms"
                  class="hover:text-gold-500 transition-colors"
                  >เงื่อนไขการให้บริการ</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/privacy"
                  class="hover:text-gold-500 transition-colors"
                  >นโยบายความเป็นส่วนตัว</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/admin"
                  class="hover:text-gold-500 transition-colors"
                  >ผู้ดูแลระบบ</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm"
        >
          © 2024 Luxury Van Rental. สงวนลิขสิทธิ์.
        </div>
      </div>
    </footer>
  </div>
</template>
