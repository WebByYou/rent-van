<script setup lang="ts">
const token = useCookie("auth_token");
const isLoggedIn = computed(() => !!token.value);
const isMobileMenuOpen = ref(false);
const password = ref("");
const loginError = ref("");

const login = async () => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { password: password.value },
    });
    window.location.reload();
  } catch (e) {
    loginError.value = "รหัสผ่านไม่ถูกต้อง";
  }
};

const logout = () => {
  token.value = null;
  window.location.reload();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const isContentMenuOpen = ref(true);
</script>

<template>
  <ClientOnly>
    <div class="min-h-screen bg-gray-100 font-sans text-gray-900">
      <!-- Login Screen -->
      <div
        v-if="!isLoggedIn"
        class="min-h-screen flex items-center justify-center bg-dark-900 px-4"
      >
        <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-serif font-bold text-dark-900">
              Admin<span class="text-gold-500">Panel</span>
            </h1>
            <p class="text-gray-500 mt-2">เข้าสู่ระบบเพื่อจัดการเว็บไซต์</p>
          </div>
          <form @submit.prevent="login" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >รหัสผ่าน</label
              >
              <input
                v-model="password"
                type="password"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 p-3 border"
                placeholder="••••••••"
              />
            </div>
            <p v-if="loginError" class="text-red-600 text-sm text-center">
              {{ loginError }}
            </p>
            <button
              type="submit"
              class="w-full bg-dark-900 text-white py-3 px-4 rounded-lg hover:bg-gold-500 hover:text-dark-900 transition-all duration-300 font-bold"
            >
              เข้าสู่ระบบ
            </button>
          </form>
          <div class="mt-6 text-center">
            <NuxtLink to="/" class="text-sm text-gray-500 hover:text-dark-900"
              >← กลับไปหน้าเว็บไซต์</NuxtLink
            >
          </div>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div v-else class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside
          class="bg-dark-900 text-white w-64 flex-shrink-0 hidden md:flex flex-col transition-all duration-300"
        >
          <div class="p-6 border-b border-white/10">
            <h1 class="text-2xl font-serif font-bold">
              Admin<span class="text-gold-500">Panel</span>
            </h1>
          </div>
          <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
            >
              <span>🚐</span> จัดการรถ
            </NuxtLink>
            <NuxtLink
              to="/admin/contact"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
            >
              <span>📞</span> ข้อมูลติดต่อ
            </NuxtLink>
            <!-- Manage Content Group -->
            <div>
              <button
                @click="isContentMenuOpen = !isContentMenuOpen"
                class="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                :class="{ 'bg-white/5': isContentMenuOpen }"
              >
                <div class="flex items-center gap-3">
                  <span>📝</span>
                  <span>จัดการเนื้อหา</span>
                </div>
                <span
                  class="transform transition-transform duration-200"
                  :class="{ 'rotate-180': isContentMenuOpen }"
                  >▼</span
                >
              </button>

              <div
                v-show="isContentMenuOpen"
                class="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2"
              >
                <NuxtLink
                  to="/admin/content?page=about"
                  class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-gray-300"
                  active-class="text-gold-500 font-bold bg-white/5"
                >
                  🏢 เกี่ยวกับเรา
                </NuxtLink>
                <NuxtLink
                  to="/admin/content?page=terms"
                  class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-gray-300"
                  active-class="text-gold-500 font-bold bg-white/5"
                >
                  📜 เงื่อนไขบริการ
                </NuxtLink>
                <NuxtLink
                  to="/admin/content?page=privacy"
                  class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-gray-300"
                  active-class="text-gold-500 font-bold bg-white/5"
                >
                  🔒 นโยบายส่วนตัว
                </NuxtLink>
              </div>
            </div>
            <NuxtLink
              to="/admin/password"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
            >
              <span>🔒</span> เปลี่ยนรหัสผ่าน
            </NuxtLink>
          </nav>
          <div class="p-4 border-t border-white/10">
            <button
              @click="logout"
              class="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            >
              <span>🚪</span> ออกจากระบบ
            </button>
          </div>
        </aside>

        <!-- Mobile Sidebar Overlay -->
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 bg-black/50 z-40 md:hidden"
          @click="toggleMobileMenu"
        ></div>

        <!-- Mobile Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 bg-dark-900 text-white w-64 z-50 transform transition-transform duration-300 md:hidden flex flex-col"
          :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        >
          <div
            class="p-6 border-b border-white/10 flex justify-between items-center"
          >
            <h1 class="text-2xl font-serif font-bold">
              Admin<span class="text-gold-500">Panel</span>
            </h1>
            <button @click="toggleMobileMenu" class="text-white">✕</button>
          </div>
          <nav class="flex-1 p-4 space-y-2">
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
              @click="isMobileMenuOpen = false"
            >
              <span>🚐</span> จัดการรถ
            </NuxtLink>
            <NuxtLink
              to="/admin/contact"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
              @click="isMobileMenuOpen = false"
            >
              <span>📞</span> ข้อมูลติดต่อ
            </NuxtLink>
            <NuxtLink
              to="/admin/content"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
              @click="isMobileMenuOpen = false"
            >
              <span>📝</span> จัดการเนื้อหา
            </NuxtLink>
            <NuxtLink
              to="/admin/password"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              active-class="bg-gold-500 text-dark-900 font-bold"
              @click="isMobileMenuOpen = false"
            >
              <span>🔒</span> เปลี่ยนรหัสผ่าน
            </NuxtLink>
          </nav>
          <div class="p-4 border-t border-white/10">
            <button
              @click="logout"
              class="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            >
              <span>🚪</span> ออกจากระบบ
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Topbar (Mobile) -->
          <header
            class="bg-white shadow-sm md:hidden flex items-center justify-between p-4 z-30"
          >
            <button @click="toggleMobileMenu" class="text-dark-900">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span class="font-bold text-dark-900">Admin Panel</span>
            <div class="w-6"></div>
            <!-- Spacer -->
          </header>

          <!-- Page Content -->
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
