export default defineNuxtRouteMiddleware(async () => {
    const { requireGuest } = await useAuthGuard()

    return await requireGuest()
})
