import type { UserProfile } from '~/types'

export const useAuthGuard = async () => {
    const currentUser = await getCurrentUser()
    const userProfile = ref<UserProfile | null>(null)

    const getProfile = async () => {
        if (!currentUser) return

        try {
            const idToken = await currentUser.getIdToken()
            const response = await $fetch<{ success: boolean, user: UserProfile }>('/api/auth/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            })

            userProfile.value = response.user
            return response.user
        } catch (err: any) {
            throw err
        }
    }

    const requireAuth = async (redirectPath = '/') => {
        // Check if user is authenticated
        if (!currentUser) {
            return navigateTo({
                path: '/login',
                query: { redirect: redirectPath },
            })
        }

        return true
    }

    const requireGuest = async () => {
        // If user is authenticated, redirect to home
        if (currentUser) {
            return navigateTo('/')
        }

        return true
    }

    const requireAdmin = async (redirectPath = '/') => {
        // First ensure user is authenticated
        const authCheck = await requireAuth(redirectPath)

        if (authCheck !== true) return authCheck

        // Load profile if not available
        if (!userProfile.value) {
            try {
                await getProfile()
            } catch (error) {
                console.error('Failed to load user profile:', error)

                return navigateTo({
                    path: '/login',
                    query: { redirect: redirectPath },
                })
            }
        }

        // Check for admin role
        if (!userProfile.value?.roles.admin) {
            return navigateTo('/')
        }

        return true
    }

    const requireRole = async (role: keyof UserProfile['roles']) => {
        // First ensure user is authenticated
        const authCheck = await requireAuth()
        if (authCheck !== true) return authCheck

        // Load profile if not available
        if (!userProfile.value) {
            try {
                await getProfile()
            } catch (error) {
                console.error('Failed to load user profile:', error)
                return navigateTo('/login')
            }
        }

        // Check for the specified role
        if (!userProfile.value?.roles[role]) {
            return navigateTo('/')
        }

        return true
    }

    return {
        requireAuth,
        requireGuest,
        requireAdmin,
        requireRole,
    }
}
