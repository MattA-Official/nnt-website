export default defineNuxtRouteMiddleware(async () => {
    const { requireGuest } = useAuthGuard()

    return await requireGuest()
})
