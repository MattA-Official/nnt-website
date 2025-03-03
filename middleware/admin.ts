export default defineNuxtRouteMiddleware(async () => {
    const { requireAdmin } = useAuthGuard()

    return await requireAdmin()
})
