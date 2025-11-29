export default defineNuxtRouteMiddleware((to, from) => {
  // Only protect /admin routes
  if (to.path.startsWith("/admin")) {
    // Allow access to login page
    if (to.path === "/admin/login") {
      return;
    }

    const token = useCookie("auth_token");

    if (!token.value) {
      return navigateTo("/admin/login");
    }
  }
});
