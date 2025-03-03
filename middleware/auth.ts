export default defineNuxtRouteMiddleware(async (to) => {
    const { requireAuth } = useAuthGuard()

    return await requireAuth('/login')
})
