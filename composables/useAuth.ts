// composables/useAuth.ts
import { useCurrentUser, useFirebaseAuth, getCurrentUser } from 'vuefire'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import type { UserProfile } from '~/types'

export const useAuth = () => {
    // Use Nuxt's state management for hydration between server and client
    const userProfile = useState<UserProfile | null>('userProfile', () => null)
    const isLoading = useState<boolean>('auth:loading', () => false)
    const error = useState<string | null>('auth:error', () => null)
    const requiresSetup = useState<boolean>('auth:requiresSetup', () => false)
    const authReady = useState<boolean>('auth:ready', () => false)

    // Get current user from vuefire
    const currentUser = useCurrentUser()
    const auth = useFirebaseAuth()!

    // Function to safely get current user, waiting for auth to be ready
    const getUser = async () => {
        // If we already have a user or auth is ready and currentUser is null
        // we can use the reactive currentUser value
        if (currentUser.value !== undefined) {
            return currentUser.value
        }

        // If auth is not ready yet, use getCurrentUser() which returns a promise
        try {
            isLoading.value = true
            const user = await getCurrentUser()
            authReady.value = true
            return user
        } catch (err) {
            console.error('Error getting current user:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // Method to get the user profile from the server
    const getProfile = async () => {
        if (userProfile.value) return userProfile.value

        // Get the user, waiting if necessary
        const user = await getUser()
        if (!user) return null

        isLoading.value = true
        error.value = null

        try {
            const idToken = await user.getIdToken()
            const response = await $fetch<{ success: boolean, user: UserProfile }>('/api/auth/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            })

            userProfile.value = response.user
            return response.user
        } catch (err: any) {
            error.value = 'Failed to load profile'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const loginWithGoogle = async () => {
        isLoading.value = true
        error.value = null

        try {
            // Sign in with Google popup
            const provider = new GoogleAuthProvider()

            // Requested Scopes
            provider.addScope('profile')
            provider.addScope('email')

            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken()

            // Verify with server and ensure domain restriction
            const response = await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken }
            })

            // If successful, stay signed in
            return response
        } catch (err: any) {

            if (err.response?.status === 401) {
                error.value = 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.'
            } else {
                error.value = err.message || 'Authentication failed'
            }

            // Make sure user is signed out if the server rejected them
            await signOut(auth)

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        isLoading.value = true
        error.value = null

        try {
            // Sign in with email and password
            await signInWithEmailAndPassword(auth, email, password)

            // Get user profile from server
            const response = await getProfile()

            // If successful, stay signed in
            return response
        } catch (err: any) {
            switch (err.code) {
                case 'auth/invalid-credential':
                    error.value = 'Invalid email or password';
                    break;
                case 'auth/too-many-requests':
                    error.value = 'Too many login attempts. Please try again later';
                    break;
                case 'auth/invalid-email':
                    error.value = 'Please enter a valid email address';
                    break;
                default:
                    error.value = 'Unable to sign in. Please try again';
            }

            // Make sure user is signed out if the server rejected them
            await signOut(auth)

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const register = async (email: string, password: string) => {
        isLoading.value = true
        error.value = null

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const idToken = await result.user.getIdToken()

            // Create user profile on server
            const response = await $fetch<{ success: boolean, user: UserProfile, requiresSetup: boolean }>('/api/auth/register', {
                method: 'POST',
                body: { idToken }
            })

            userProfile.value = response.user
            requiresSetup.value = response.requiresSetup

            return {
                user: response.user,
                requiresSetup: response.requiresSetup
            }
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    error.value = 'This email is already registered';
                    break;
                case 'auth/invalid-email':
                    error.value = 'Please enter a valid email address';
                    break;
                default:
                    error.value = 'Registration failed. Please try again';
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        isLoading.value = true
        error.value = null

        try {
            // Attempt to sign out
            await signOut(auth)
        } catch (err: any) {
            error.value = err.message || 'Logout failed'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateProfile = async (profileData: Partial<UserProfile>) => {
        // Get the user, waiting if necessary
        const user = await getUser()
        if (!user) return null

        isLoading.value = true
        error.value = null

        try {
            const idToken = await user.getIdToken()
            const response = await $fetch<{ success: boolean, user: UserProfile }>('/api/auth/profile', {
                method: 'PUT',
                body: {
                    idToken,
                    profileData
                }
            })

            userProfile.value = response.user
            return response.user
        } catch (err: any) {
            error.value = 'Failed to update profile'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Computed property for authentication state that works with loading
    const isAuthenticated = computed(() => !!currentUser.value)

    // Return our enhanced auth methods
    return {
        currentUser,
        userProfile,
        isLoading,
        error,
        requiresSetup,
        isAuthenticated,
        authReady,
        getUser,
        loginWithEmail,
        loginWithGoogle,
        logout,
        register,
        getProfile,
        updateProfile
    }
}