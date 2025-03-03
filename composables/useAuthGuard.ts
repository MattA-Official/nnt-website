import { useAuth } from './useAuth'
import type { UserProfile } from '~/types'

export const useAuthGuard = () => {
    const { currentUser, userProfile, getProfile, isLoading } = useAuth()

    const requireAuth = async (redirectPath = '/login') => {
        // Check if user is authenticated
        if (!currentUser.value) {
            return navigateTo({
                path: redirectPath,
                query: { redirect: encodeURIComponent(useRoute().fullPath) },
            })
        }

        return true
    }

    const requireGuest = async (redirectPath = '/') => {
        // If user is authenticated, redirect to specified path
        if (currentUser.value) {
            return navigateTo(redirectPath)
        }

        return true
    }

    const requireAdmin = async () => {
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
        isLoading,
    }
}
