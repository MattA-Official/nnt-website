export default defineNuxtRouteMiddleware(async (to) => {
    const { requireAuth } = await useAuthGuard()

    return await requireAuth(to.path)
})
