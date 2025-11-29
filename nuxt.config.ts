// https://nuxt.com/docs/api/configuration/nuxt-config
// Nuxt Config - Restart Triggered
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: "Van VIP Service Thailand",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&display=swap",
        },
      ],
    },
  },
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET,
    adminPassword: process.env.NUXT_ADMIN_PASSWORD,
  },
});
