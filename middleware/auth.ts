export default defineNuxtRouteMiddleware(async (to) => {
    const user = await getCurrentUser()

    // If user is logged in and trying to access auth pages, redirect to home
    if (user && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/')
    } else if (!user && (to.path !== '/login' && to.path !== '/register')) {
        // If user is not logged in and trying to access protected pages, redirect to login
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }
})
