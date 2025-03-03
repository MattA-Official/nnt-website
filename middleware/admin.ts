export default defineNuxtRouteMiddleware(async () => {
    const { requireAdmin } = await useAuthGuard()

    return await requireAdmin()
})
